from maestro_api.services.auth.oauth import OauthClient


class TestOauthClient:
    issuer = "https://issuer.test"
    client_id = "test_client"
    client_secret = "test_secret"
    scope = "test_scope"
    redirect_uri = "http://test.com/redirect"

    def test_get_authorize_url(self):
        client = OauthClient(
            self.issuer,
            self.client_id,
            self.client_secret,
            self.redirect_uri,
            self.scope,
        )

        authorize_url = client.get_authorize_url()

        extected_url = (
            "https://issuer.test/connect/authorize"
            "?client_id=test_client"
            "&response_type=code"
            "&scope=test_scope"
            "&redirect_uri=http%3A%2F%2Ftest.com%2Fredirect"
            "&response_mode=form_post"
        )

        assert extected_url == authorize_url

    def test_make_access_token(self, mocker):

        client = OauthClient(
            self.issuer,
            self.client_id,
            self.client_secret,
            self.redirect_uri,
            self.scope,
        )

        expected = {"test": 1}

        class RequestMock:
            def json(self):
                return expected

        mocker.patch("requests.post", return_value=RequestMock())

        data = client.make_token_access(code="123")

        mocker.resetall()

        assert expected == data

    def test_make_refresh_token(self, mocker):

        client = OauthClient(
            self.issuer,
            self.client_id,
            self.client_secret,
            self.redirect_uri,
            self.scope,
        )

        expected = {"test": 1}

        class RequestMock:
            def json(self):
                return expected

        mocker.patch("requests.post", return_value=RequestMock())

        data = client.make_token_refresh(refresh_roken="123")

        mocker.resetall()

        assert expected == data
