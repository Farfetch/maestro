import os
import pathlib

from dotenv import load_dotenv

from maestro_api.enums import LogLevel

load_dotenv()


def parse_bool(str_value):
    return str_value.lower() in ["true", "1"]


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

SWAGGER_ENABLED = parse_bool(os.environ.get("SWAGGER_ENABLED", "False"))

SCHEDULER_ENABLED = parse_bool(os.environ.get("SCHEDULER_ENABLED", "True"))

JMETER_BASE_IMAGE = "jmeter"

SECRET_KEY = os.environ.get("SECRET_KEY", "SECRETKEY")

FRONTEND_PUBLIC_DIR = os.path.join(ROOT_DIRECTORY, "frontend_build")

HTTPS_REDIRECTS_ENABLED = parse_bool(os.environ.get("HTTPS_REDIRECTS_ENABLED", "False"))
