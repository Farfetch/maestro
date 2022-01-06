from maestro_api.services.auth.request_validator import (
    AuthRequestValidator,
    UnauthorizedAccessError,
    ExpiredAccessTokenError,
)


class TestRequestValidator:
    def test_validate_auth_header(self):
        auth_header = "Bearer test_token"
        auth_api_token = "test_token"

        re_validator = AuthRequestValidator()

        user = re_validator.validate_auth_header(auth_header, auth_api_token)

        assert dict(scope=None, email=None, uuid="maestro") == user

    def test_validate_auth_header_with_exception(self):

        auth_header = "Bearer invalid_token"
        auth_api_token = "test_token"

        re_validator = AuthRequestValidator()

        try:
            re_validator.validate_auth_header(auth_header, auth_api_token)
            raise AssertionError("UnauthorizedAccessError should be thrown")
        except UnauthorizedAccessError as e:
            assert {"description": "Maestro Agent token is not valid"} == e.error_msg

    def test_validate_tokens(self, mocker):
        access_token = "test_access_token"
        refresh_token = "test_refresh_token"

        class JWTAuthorizationMock:
            def validate_token(self, token):
                assert access_token == token

                return {
                    "scope": "test_scope",
                    "email": "test_email",
                    "uuid": "test_uuid",
                }

        mocker.patch(
            "maestro_api.services.auth.authorization.JWTAuthorization.instance",
            return_value=JWTAuthorizationMock(),
        )

        re_validator = AuthRequestValidator()

        auth_data = re_validator.validate_tokens(access_token, refresh_token)

        assert {
            "user": dict(
                scope="test_scope",
                email="test_email",
                uuid="test_uuid",
            ),
            "update_tokens": False,
            "access_token": access_token,
            "refresh_token": refresh_token,
        } == auth_data

    def test_validate_tokens_with_token_refresh(self, mocker):
        access_token = "test_access_token"
        refresh_token = "test_refresh_token"

        class OauthClientMock:
            def make_token_refresh(self, refresh_token):
                assert "test_refresh_token" == refresh_token

                return {
                    "access_token": "new_access_token",
                    "refresh_token": "new_refresh_token",
                }

        class JWTAuthorizationMock:
            called = 0

            def validate_token(self, token):
                self.called += 1
                if self.called == 1:
                    raise ExpiredAccessTokenError("Token is expired")
                elif self.called == 2:
                    return {
                        "scope": "test_scope",
                        "email": "test_email",
                        "uuid": "test_uuid",
                    }
                raise AssertionError("should not be called more than 2 times")

        mocker.patch(
            (
                "maestro_api.services.auth.request_validator"
                ".AuthRequestValidator.create_oauth_client"
            ),
            return_value=OauthClientMock(),
        )
        mocker.patch(
            "maestro_api.services.auth.authorization.JWTAuthorization.instance",
            return_value=JWTAuthorizationMock(),
        )

        re_validator = AuthRequestValidator()

        auth_data = re_validator.validate_tokens(access_token, refresh_token)

        assert {
            "user": dict(
                scope="test_scope",
                email="test_email",
                uuid="test_uuid",
            ),
            "update_tokens": True,
            "access_token": "new_access_token",
            "refresh_token": "new_refresh_token",
        } == auth_data

    def test_validate_tokens_with_whitelisted_email(self, mocker):
        access_token = "test_access_token"
        refresh_token = "test_refresh_token"

        class JWTAuthorizationMock:
            def validate_token(self, token):
                assert access_token == token

                return {
                    "scope": "test_scope",
                    "email": "test_email",
                    "uuid": "test_uuid",
                }

        mocker.patch(
            "maestro_api.services.auth.authorization.JWTAuthorization.instance",
            return_value=JWTAuthorizationMock(),
        )

        re_validator = AuthRequestValidator()
        re_validator.emails_whitelist = ["some_other_email"]

        try:
            re_validator.validate_tokens(access_token, refresh_token)
            raise AssertionError("UnauthorizedAccessError should be thrown")
        except UnauthorizedAccessError as e:
            assert {"description": "User test_email doesn't have access"} == e.error_msg
