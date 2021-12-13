from werkzeug.middleware.dispatcher import DispatcherMiddleware

from maestro_api import create_app, create_frontend_app
from maestro_api import settings

from maestro_api.logging import Logger

Logger.setup_logging()

maestro_app = create_frontend_app(settings)

maestro_api = create_app(settings)

maestro_app.wsgi_app = DispatcherMiddleware(
    maestro_app.wsgi_app, {"/api": maestro_api.wsgi_app}
)
