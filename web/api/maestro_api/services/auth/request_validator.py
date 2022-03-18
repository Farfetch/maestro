from maestro_api.services.auth.authorization import (
    BearerAuthorization,
    JWTAuthorization,
    ExpiredAccessTokenError,
    UnauthorizedAccessError,
)
from maestro_api.services.auth.oauth import OauthClient
from maestro_api.settings import (
    AUTH_API_USER,
    OAUTH_HOST,
    OAUTH_WELL_KNOWN_CONFIGURATION_HOST,
    OAUTH_ISSUER,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_CLIENT_REDIRECT_URI,
    OAUTH_SCOPE,
    OAUTH_EMAILS_WHITELIST,
)
from maestro_api.logging import Logger


class AuthRequestValidator:
    emails_whitelist = OAUTH_EMAILS_WHITELIST

    def create_oauth_client(self):
        "Create oauth Client based on configuration from environment"
        client = OauthClient(
            host=OAUTH_HOST,
            client_id=OAUTH_CLIENT_ID,
            client_secret=OAUTH_CLIENT_SECRET,
            redirect_uri=OAUTH_CLIENT_REDIRECT_URI,
            scope=OAUTH_SCOPE,
        )

        return client

    def validate_auth_header(self, req_auth_header, api_token):
        "Varidate authorization header and compare with token in configuration"
        BearerAuthorization.validate_authorization_header(req_auth_header, api_token)

        user = dict(scope=None, email=None, uuid=AUTH_API_USER)

        return user

    def validate_tokens(self, access_token, refresh_token):
        if not access_token or not refresh_token:
            raise UnauthorizedAccessError("Access/Refresh tokens are not valid")

        jwt_authorization = JWTAuthorization.instance(
            host=OAUTH_WELL_KNOWN_CONFIGURATION_HOST, issuer=OAUTH_ISSUER
        )
        update_tokens = False

        try:
            chaims = jwt_authorization.validate_token(token=access_token)
        except ExpiredAccessTokenError:
            Logger.info("Access token is expired, refreshing...")
            update_tokens = True
            try:
                client = self.create_oauth_client()

                refresh_data = client.make_token_refresh(refresh_token)
                access_token = refresh_data.get("access_token", None)
                refresh_token = refresh_data.get("refresh_token", None)

                chaims = jwt_authorization.validate_token(token=access_token)
                Logger.info("Access token updated.")
            except ExpiredAccessTokenError:
                raise UnauthorizedAccessError(
                    "Something went wrong. Access token is expired %s"
                    % "after atempt to update with refresh token"
                )

        user = dict(
            scope=chaims.get("scope"),
            email=chaims.get("email"),
            uuid=chaims.get("uuid"),
        )

        if (
            len(self.emails_whitelist) > 0
            and user["email"] not in self.emails_whitelist
        ):
            raise UnauthorizedAccessError(
                {"description": "User %s doesn't have access" % user["email"]}
            )

        return {
            "user": user,
            "update_tokens": update_tokens,
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
