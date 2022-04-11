import os
import pathlib

from dotenv import load_dotenv

from maestro_cli.enums import LogLevel

load_dotenv()


def parse_bool(str_value):
    return str_value.lower() in ["true", "1"]


APP_NAME = "maestro_cli"
LOG_LEVEL = os.environ.get("LOG_LEVEL", LogLevel.INFO.value)

ROOT_DIRECTORY = pathlib.Path().absolute()

MAESTRO_API_HOST = os.environ.get("MAESTRO_API_HOST", "http://localhost:5000")
MAESTRO_API_TOKEN = os.environ.get("MAESTRO_API_TOKEN", "")
