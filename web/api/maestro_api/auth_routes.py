from flask import request, redirect, make_response

from maestro_api.services.auth.oauth import OauthClient
from maestro_api.logging import Logger
from maestro_api.db.repo.user import UserRepository
from maestro_api.db.models.user import UserRole

from maestro_api.settings import (
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_HOST,
    OAUTH_CLIENT_REDIRECT_URI,
    OAUTH_SCOPE,
    AUTH_ADMIN_EMAIL,
)


def create_oauth_client():
    "Create oauth Client based on configuration from environment"
    client = OauthClient(
        host=OAUTH_HOST,
        client_id=OAUTH_CLIENT_ID,
        client_secret=OAUTH_CLIENT_SECRET,
        redirect_uri=OAUTH_CLIENT_REDIRECT_URI,
        scope=OAUTH_SCOPE,
    )

    return client


def init_auth_routes(flask_app):
    user_repository = UserRepository()

    @flask_app.route("/oauth/authorize")
    def authorize():
        client = create_oauth_client()
        authorize_url = client.get_authorize_url()

        return redirect(authorize_url)

    @flask_app.route("/oauth/callback", methods=["POST"])
    def oauth_callback():
        "Authroises client and store token in the cookie"
        try:
            client = create_oauth_client()
            req_data = request.form.to_dict()

            data = client.make_token_access(code=req_data.get("code"))
            if data is None:
                raise Exception("Couldn't receive access token from authorization code")

            refresh_token = data.get("refresh_token")
            access_token = data.get("access_token")

            user = client.get_userinfo(access_token)

            Logger.debug(f"User info: {user}")

            role = (
                UserRole.ADMIN.value
                if user["email"] == AUTH_ADMIN_EMAIL
                else UserRole.USER.value
            )
            user_repository.create_or_update(
                name=user["name"], email=user["preferred_username"], role=role
            )

            response = make_response(redirect("/"))
            response.set_cookie("access_token", access_token)
            response.set_cookie("refresh_token", refresh_token)

        except Exception as e:
            Logger.error(str(e))
            response = make_response(str(e))

        return response

    @flask_app.route("/login")
    def login():
        "Redirect user to dashboard or authorization endpoint based on session"
        access_token = request.cookies.get("access_token", None)

        if access_token:
            return redirect("/")

        return redirect("/oauth/authorize")

    @flask_app.route("/logout")
    def logout():
        response = redirect("/login")
        response.set_cookie("access_token", "", expires=0)
        response.set_cookie("refresh_token", "", expires=0)

        return response
