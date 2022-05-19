from werkzeug.middleware.dispatcher import DispatcherMiddleware
from pytz import UTC
from apscheduler.schedulers.background import BackgroundScheduler

from maestro_api import create_app, create_frontend_app
from maestro_api.db.mongo import init_db_data
from maestro_api import settings
from maestro_api.scheduler import init_scheduler
from maestro_api.logging import Logger

Logger.setup_logging()

maestro_app = create_frontend_app(settings)

maestro_api = create_app(settings)

init_db_data(maestro_api)

maestro_app.wsgi_app = DispatcherMiddleware(
    maestro_app.wsgi_app, {"/api": maestro_api.wsgi_app}
)


if settings.SCHEDULER_ENABLED:
    scheduler = BackgroundScheduler(timezone=UTC)
    init_scheduler(scheduler)
