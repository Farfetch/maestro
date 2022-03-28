import os
import pathlib

from dotenv import load_dotenv
from maestro_api.enums import LogLevel
from maestro_api.libs.utils import parse_bool

load_dotenv()


def parse_list(str_value):
    if str_value is None or "":
        return []
    return [e.strip() for e in str_value.split(",")]


TESTING = parse_bool(os.environ.get("TESTING", "False"))

ROOT_DIRECTORY = pathlib.Path().absolute()

MAESTRO_API_VERSION = 1

DEFAULT_LOGGER_NAME = "maestro_logger"
LOG_LEVEL = os.environ.get("LOG_LEVEL", LogLevel.INFO.value)

MONGODB_SETTINGS = {
    "host": os.environ.get("MONGODB_HOST", "localhost"),
    "port": int(os.environ.get("MONGODB_PORT", 27017)),
    "db": os.environ.get("MONGODB_DB", "maestro"),
}

SWAGGER = {
    "title": "Maestro API",
    "uiversion": 3,
    "description": "Maestro API documentation",
    "specs_route": "/",
    "version": MAESTRO_API_VERSION,
}

SWAGGER_ENABLED = parse_bool(os.environ.get("SWAGGER_ENABLED", "True"))

JMETER_BASE_IMAGE = "jmeter"

SECRET_KEY = os.environ.get("SECRET_KEY", "SECRETKEY")

FRONTEND_PUBLIC_DIR = os.path.join(ROOT_DIRECTORY, "frontend_build")

HTTPS_REDIRECTS_ENABLED = parse_bool(os.environ.get("HTTPS_REDIRECTS_ENABLED", "False"))


# AUTH CONFIGURATION
AUTH_API_ENABLED = parse_bool(os.environ.get("AUTH_API_ENABLED", "True"))
AUTH_API_USER = os.environ.get("AUTH_API_USER", "maestro")
AUTH_API_TOKEN = os.environ.get("AUTH_API_TOKEN", "")

AUTH_ADMIN_EMAIL = os.environ.get("AUTH_ADMIN_EMAIL", "")

# OAUTH CONFIGURATION
OAUTH_ENABLED = parse_bool(os.environ.get("OAUTH_ENABLED", "False"))
OAUTH_HOST = os.environ.get("OAUTH_HOST")
OAUTH_WELL_KNOWN_CONFIGURATION_HOST = os.environ.get(
    "OAUTH_WELL_KNOWN_CONFIGURATION_HOST", OAUTH_HOST
)
OAUTH_ISSUER = os.environ.get("OAUTH_ISSUER")
OAUTH_CLIENT_ID = os.environ.get("OAUTH_CLIENT_ID")
OAUTH_CLIENT_SECRET = os.environ.get("OAUTH_CLIENT_SECRET")
OAUTH_CLIENT_REDIRECT_URI = os.environ.get("OAUTH_CLIENT_REDIRECT_URI")
OAUTH_SCOPE = os.environ.get("OAUTH_SCOPE", "openid user.read profile offline_access")
OAUTH_EMAILS_WHITELIST = parse_list(os.environ.get("OAUTH_EMAILS_WHITELIST", None))


# MOCK CONFIGURATION

MOCK_AUTH_CURRENT_USER_EMAIL = os.environ.get("MOCK_AUTH_CURRENT_USER_EMAIL", None)
MOCK_AUTH_ANONYMOUS_USER_EMAIL = os.environ.get(
    "MOCK_AUTH_ANONYMOUS_USER_EMAIL", "anonymous@maestro.net"
)
