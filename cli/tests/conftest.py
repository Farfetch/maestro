import pytest
from maestro_cli.logging import Logger


@pytest.fixture(scope="session", autouse=True)
def setup_testing_env():
    Logger.setup_logging()
    Logger.instance.disabled = True
