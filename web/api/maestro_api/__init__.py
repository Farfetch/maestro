from flasgger import Swagger
from flask import Flask

from maestro_api.db.mongo import init_db
from maestro_api.api_routes import init_api_routes


def create_app(settings):
    "Initialize Maestro API routes"
    flask_app = Flask(__name__)

    flask_app.config.from_object(settings)

    if settings.SWAGGER_ENABLED:
        Swagger(
            flask_app,
            template_file="swagger/template.yml",
        )

    init_db(flask_app)

    init_api_routes(flask_app)

    return flask_app


def create_frontend_app(settings):
    "Initialize Maestro frontend routes"
    flask_app = Flask(__name__, static_url_path=settings.FRONTEND_PUBLIC_DIR)

    flask_app.config.from_object(settings)

    init_api_routes(flask_app)

    return flask_app
