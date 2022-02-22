import os
import pathlib

from dotenv import load_dotenv

from maestro_agent.enums import LogLevel

load_dotenv()


def parse_bool(str_value):
    return str_value.lower() in ["true", "1"]


AGENT_HOST = os.environ.get("AGENT_HOST", False)

DEFAULT_LOGGER_NAME = "maestro_logger"
LOG_LEVEL = os.environ.get("LOG_LEVEL", LogLevel.INFO.value)
ENABLE_MAESTRO_API_HANDLER = os.environ.get("ENABLE_MAESTRO_API_HANDLER", True)

ROOT_DIRECTORY = pathlib.Path().absolute()

MAESTRO_API_HOST = os.environ.get("MAESTRO_API_HOST", "http://localhost:5000")
MAESTRO_API_TOKEN = os.environ.get("MAESTRO_API_TOKEN", "")

MAESTRO_CSV_WRITER_ENABLED = parse_bool(
    os.environ.get("MAESTRO_CSV_WRITER_ENABLED", "True")
)

MAESTRO_METRICS_PROCESSING_BULK_SIZE = int(
    os.environ.get("MAESTRO_METRICS_PROCESSING_BULK_SIZE", 100)
)
MAESTRO_AGENT_WAITING_SERVERS_TIMEOUT = int(
    os.environ.get("MAESTRO_AGENT_WAITING_SERVERS_TIMEOUT", 120)
)

JMETER_BASE_IMAGE = "maestrojmeter:%s"
JMETER_IMAGE_BASE_REPO = os.environ.get("JMETER_IMAGE_BASE_REPO", "")
JMETER_IMAGE_BASE_VERSION = os.environ.get("JMETER_IMAGE_BASE_VERSION", "")
JMETER_IMAGE_HEAP = os.environ.get(
    "JMETER_IMAGE_HEAP", "-Xms1g -Xmx1g -XX:MaxMetaspaceSize=256m"
)

JMETER_CONTAINER_NAME = os.environ.get("JMETER_CONTAINER_NAME", "maestrojmeter")

SECRET_KEY = os.environ.get("SECRET_KEY", "SECRET_KEY")


JMETER_DIR = os.path.join(ROOT_DIRECTORY, "jmeter")


# HOST MACHINE DIRECTORIES

HOST_MOUNT_DIR = os.environ.get("HOST_MOUNT_DIR", "/tmp/maestrojmeter")

# RUN DIRECTORIES

JMETER_RUN_DIR = os.path.join(JMETER_DIR, "run", "%s")  # jmeter/run/{id}


JMETER_RUN_PLAN_FILENAME = "plan.jmx"
JMETER_RUN_PROPERTIES_FILENAME = "maestro.properties"
JMETER_RUN_CUSTOM_DATA_DIRNAME = "custom_data"


JMETER_RUN_CUSTOM_DATA_DIR = os.path.join(
    JMETER_RUN_DIR, JMETER_RUN_CUSTOM_DATA_DIRNAME
)  # jmeter/run/{id}/custom_data

JMETER_RUN_PLAN_FILE = os.path.join(
    JMETER_RUN_DIR, JMETER_RUN_PLAN_FILENAME
)  # jmeter/run/{id}/plan.jmx

JMETER_RUN_PROPERTIES_FILE = os.path.join(
    JMETER_RUN_DIR, JMETER_RUN_PROPERTIES_FILENAME
)  # jmeter/run/{id}/maestro.properties

JMETER_RUN_DIR_RELATIVE_PATH = os.path.relpath(JMETER_RUN_DIR, JMETER_DIR)

# TEST RUN REALTIME METRICS MNT DIRECTORIES

JMETER_RUN_METRICS_FILENAME = "run_metrics.csv"

JMETER_RUN_MOUNT_DIR = os.path.join(HOST_MOUNT_DIR, "%s")  # /tmp/maestrojmeter/{id}


JMETER_RUN_METRICS_PATH = os.path.join(
    JMETER_RUN_MOUNT_DIR, JMETER_RUN_METRICS_FILENAME
)  # mnt/{id}/run_metrics.csv


# JMETER DOCKER DIRECTORIES

JMETER_DOCKER_RUN_DIR = "/srv/run"
JMETER_DOCKER_MOUNT_DIR = "/mnt"

JMETER_DOCKER_CUSTOM_DATA_DIR = os.path.join(
    JMETER_DOCKER_RUN_DIR,
    JMETER_RUN_CUSTOM_DATA_DIRNAME,
)  # /srv/run/custom_data

JMETER_DOCKER_PLAN_FILE = os.path.join(
    JMETER_DOCKER_RUN_DIR,
    JMETER_RUN_PLAN_FILENAME,
)  # /srv/run/plan.jmx

JMETER_DOCKER_PROPERTIES_FILE = os.path.join(
    JMETER_DOCKER_RUN_DIR,
    JMETER_RUN_PROPERTIES_FILENAME,
)  # /srv/run/maestro.properties


JMETER_DOCKER_METRICS_FILE = os.path.join(
    JMETER_DOCKER_MOUNT_DIR,
    JMETER_RUN_METRICS_FILENAME,
)  # /mnt/run_metrics.csv
