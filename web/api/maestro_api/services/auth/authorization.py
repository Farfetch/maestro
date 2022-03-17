import requests
from jose import jwt


class UnauthorizedAccessError(Exception):
    """Exception raised for errors on the authorization."""

    def __init__(self, error_msg) -> None:
        """Init method for UnauthorizedAccessError class.

        Args:
            error_msg (dict): The error message description
        """
        super().__init__()
        self.error_msg = error_msg
        self.status_code = 401


class ExpiredAccessTokenError(UnauthorizedAccessError):
    """Exception raised when access token is expired and needed to be refreshed"""

    pass


class JWTAuthorization(object):
    """JWTAuthorization Singleton class."""

    _instances = dict()

    def __init__(self, host: str, issuer) -> None:
        """The constructor for the Authorization class.

        well_known_obj_cache: URL of the OpenID serve
        jwks_uri: the endpoint defined for the jwks_keys
        issuer: Identifier for the creator of the token
        algorithms: only RS256 is supported
        audience: Expected recipient
        """

        self.well_known_config = "%s" % issuer
        self.issuer = issuer
        jwks_uri = f"{host}/.well-known/openid-configuration/jwks"
        self.jwks_keys = requests.get(jwks_uri).json()

    @classmethod
    def instance(cls, host, issuer):
        if cls._instances.get(host, None) is None:
            cls._instances[host] = JWTAuthorization(host=host, issuer=issuer)

        return cls._instances.get(host)

    def validate_token(
        self, token: str, audience="user.read", algorithms=["RS256"]
    ) -> dict:
        """
        Validates the access token.

        Arg:
            token (str): The access token
            audience (str): user audience
            algorithms (list): Argorythms used for decoding

        Returns:
            dict: The token claims
        """

        try:
            # read a JWT header without validation
            unverified_headers = jwt.get_unverified_header(token)
        except jwt.JWTError as e:
            raise UnauthorizedAccessError({"description": "Invalid headers"}) from e

        rsa_key = self.get_rsa_key(self.jwks_keys, unverified_headers["kid"])

        try:
            chaims = jwt.decode(
                token,
                rsa_key,
                algorithms=algorithms,
                audience=audience,
                issuer=self.issuer,
            )
            return chaims
        except jwt.ExpiredSignatureError as e:
            raise ExpiredAccessTokenError(
                {"description": "The token as expired"}
            ) from e
        except jwt.JWTClaimsError as e:
            raise UnauthorizedAccessError(
                {
                    "description": (
                        "The claims are incorrect. %s"
                        % "verify if the audience and issuer are correct"
                    )
                }
            ) from e
        except Exception as e:
            raise UnauthorizedAccessError(
                {"description": "Unable to parse authorization"}
            ) from e

    def get_rsa_key(self, jwks: dict, kid: int) -> dict:
        """
        Get the 'kty', 'kid',' use', 'n' and 'e' from the keys that have the same kid.

        Returns:
            dict: rsa keys
        """
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
        return rsa_key

    def get_claims(self, token: str) -> dict:
        """Get the claims from the token.

        Args:
            token (dict): The access token
        Returns
            dict: the claims from the access token
        """
        return jwt.get_unverified_claims(token)


class BearerAuthorization:
    def validate_authorization_header(authorization_header, agent_token):
        header_token = authorization_header.split(" ")[1]

        if header_token != agent_token:
            raise UnauthorizedAccessError(
                {"description": "Maestro Agent token is not valid"}
            )
