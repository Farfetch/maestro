import pytest

from mongomock.gridfs import enable_gridfs_integration
from mongoengine.connection import get_connection, ConnectionFailure

from maestro_api import create_app
from maestro_api import settings
from maestro_api.logging import Logger

enable_gridfs_integration()


@pytest.fixture
def app():

    settings.TESTING = True
    settings.AUTH_API_ENABLED = False
    settings.OAUTH_ENABLED = False
    settings.MONGODB_SETTINGS = {
        "db": "test",
        "host": "mongomock://localhost",
        "port": 27017,
    }

    flask_app = create_app(settings)

    return flask_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture(autouse=True)
def run_before_and_after_tests(tmpdir):
    """Fixture to execute asserts before and after a test is run"""
    Logger.setup_logging()
    Logger.instance.disabled = True
    # Setup: fill with any logic you want

    yield  # this is where the testing happens

    # Teardown : fill with any logic you want

    # Clean up mock DB after each test
    try:
        connection = get_connection()
        connection.drop_database("test")
    except ConnectionFailure:
        pass
