from functools import wraps

import mongoengine
from flask import request, redirect, current_app, jsonify
from jsonschema import ValidationError, validate

from maestro_api.libs.flask.utils import bad_request_response
from maestro_api.logging import Logger
from maestro_api.services.auth.request_validator import (
    AuthRequestValidator,
    UnauthorizedAccessError,
)
from maestro_api.settings import AUTH_API_USER, AUTH_API_TOKEN


def validate_request(schema=None):
    """
    Decorator to validate request json or query params based on the schema.
    As a result data would be passed to the route as a named argument
    """

    def normalize_query_param(value):
        """
        Given a non-flattened query parameter value,
        and if the value is a list only containing 1 item,
        then the value is flattened.

        :param value: a value from a query parameter
        :return: a normalized query parameter value
        """
        return value if len(value) > 1 else value[0]

    def normalize_query(params):
        """
        Converts query parameters from only containing one value for each parameter,
        to include parameters with multiple values as lists.

        :param params: a flask query parameters data structure
        :return: a dict of normalized query parameters
        """
        params_non_flat = params.to_dict(flat=False)
        return {k: normalize_query_param(v) for k, v in params_non_flat.items()}

    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kw):
            try:
                json = request.get_json()
                args_dict = normalize_query(request.args)
                form_dict = request.form.to_dict()

                args_data = args_dict if args_dict is not None else {}
                json_data = json if json is not None else {}
                form_data = form_dict if form_dict is not None else {}

                data = {**args_data, **json_data, **form_data}

                if schema is not None:
                    validate(data, schema)

                return f(*args, **kw, data=data)
            except (ValidationError, mongoengine.errors.ValidationError) as e:
                return bad_request_response(e.message)

        return wrapper

    return decorator


def requires_auth(redirect_to_login=False):
    """
    Decorator to validate user session
    and redirects to the login page once user is not authorized
    TODO: implement decorator by using JWT token received after login
    """

    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):

            user_agent = request.headers.get("User-Agent", None)
            req_auth_header = request.headers.get("Authorization", None)
            access_token = request.cookies.get("access_token", None)
            refresh_token = request.cookies.get("refresh_token", None)

            try:

                auth_validator = AuthRequestValidator()
                if user_agent == AUTH_API_USER:
                    if current_app.config["AUTH_API_ENABLED"] is False:
                        return f(*args, **kwargs, user=None)

                    user = auth_validator.validate_auth_header(
                        req_auth_header, AUTH_API_TOKEN
                    )
                    return f(*args, **kwargs, user=user)
                else:
                    mock_email = current_app.config["MOCK_AUTH_CURRENT_USER_EMAIL"]
                    if mock_email:
                        return f(*args, **kwargs, user={"email": mock_email})

                    if current_app.config["OAUTH_ENABLED"] is False:
                        return f(*args, **kwargs, user=None)

                    auth_data = auth_validator.validate_tokens(
                        access_token, refresh_token
                    )
                    route_response = f(*args, **kwargs, user=auth_data.get("user"))

                    if auth_data.get("update_tokens"):
                        route_response.set_cookie(
                            "access_token", auth_data.get("access_token")
                        )
                        route_response.set_cookie(
                            "refresh_token", auth_data.get("refresh_token")
                        )
                    return route_response

            except UnauthorizedAccessError as e:
                Logger.error(e.error_msg)
                if redirect_to_login:
                    response = redirect("/login")
                    response.set_cookie("access_token", "", expires=0)
                    response.set_cookie("refresh_token", "", expires=0)
                    return response
                else:
                    # TODO: return unauthorized code
                    return jsonify({"error": e.error_msg}), e.status_code

        return wrapper

    return decorator
