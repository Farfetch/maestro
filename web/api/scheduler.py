from pytz import UTC
from apscheduler.schedulers.background import BlockingScheduler

from maestro_api import create_console_app
from maestro_api import settings
from maestro_api.logging import Logger
from maestro_api.scheduler import init_scheduler

Logger.setup_logging()

console_app = create_console_app(settings)

scheduler = BlockingScheduler(timezone=UTC)

init_scheduler(scheduler)
