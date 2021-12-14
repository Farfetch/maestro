from functools import wraps

import mongoengine
from flask import request
from jsonschema import ValidationError, validate

from maestro_api.libs.flask.utils import bad_request_response


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

            return f(*args, **kwargs, user=None)

        return wrapper

    return decorator
