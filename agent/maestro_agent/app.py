from maestro_agent.logging import Logger

from maestro_agent.scheduler import start_scheduler


def start_app():
    Logger.setup_logging()

    start_scheduler()
