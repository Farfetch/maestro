from mongoengine import connect

from maestro_api.db.repo.user import UserRepository
from maestro_api.db.models.user import UserRole


def init_db(flask_app=None):
    connect(**flask_app.config["MONGODB_SETTINGS"])


def init_db_data(flask_app):
    "Init DB initial data"
    if flask_app.config["OAUTH_ENABLED"] is False:
        user_repo = UserRepository()
        user_repo.create_or_update(
            name="Anonymous",
            email=flask_app.config["MOCK_AUTH_ANONYMOUS_USER_EMAIL"],
            role=UserRole.ADMIN.value,
        )
