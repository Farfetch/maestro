import requests
from urllib.parse import urlencode


class OauthClient:
    client_id = None
    client_secret = None

    # TODO: fetch URLS dynamically from '.well-known-configuration'
    configuration = {
        "authorization_endpoint": "connect/authorize",
        "token_endpoint": "connect/token",
    }

    def __init__(
        self,
        issuer: str,
        client_id: str,
        client_secret: str,
        redirect_uri: str,
        scope: str,
    ):

        self.issuer = issuer
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.scope = scope

    def get_authorize_url(self):
        """
        Get Authorise URL based on OAuth 2.0 credentials
        """
        params = {
            "client_id": self.client_id,
            "response_type": "code",
            "scope": self.scope,
            "redirect_uri": self.redirect_uri,
            "response_mode": "form_post",
        }
        query_params = urlencode(params)

        return f"{self.issuer}/{self.configuration['authorization_endpoint']}?{query_params}"

    def make_token_access(self, code: str) -> dict:
        """
        Create Access and Refresh tokens
        """

        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri,
            "code": code,
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/x-www-form-urlencoded",
        }

        res = requests.post(
            f"{self.issuer}/{self.configuration['token_endpoint']}",
            data=payload,
            headers=headers,
        ).json()

        return res

    def make_token_refresh(self, refresh_roken: str) -> dict:
        """
        Update tokens by using refresh_roken.
        NOTE: previously used access and refresh tokens will not be working after this request
        """

        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "refresh_token",
            "refresh_token": refresh_roken,
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/x-www-form-urlencoded",
        }

        res = requests.post(
            f"{self.issuer}/{self.configuration['token_endpoint']}",
            data=payload,
            headers=headers,
        ).json()

        return res
