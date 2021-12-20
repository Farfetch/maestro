import pytest
from maestro_agent.logging import Logger


@pytest.fixture(scope="session", autouse=True)
def setup_testing_env():
    Logger.setup_logging()
    Logger.instance.disabled = True
