import logging
import os
from maestro_agent.settings import (
    DEFAULT_LOGGER_NAME,
    LOG_LEVEL,
    ENABLE_MAESTRO_API_HANDLER,
)

from maestro_agent.enums import LogLevel
from maestro_agent.services.logging.handlers import MaestroApiHandler


class Logger:

    instance = None

    def set_logging_level(logger):
        available_levels = LogLevel.list()
        if LOG_LEVEL not in available_levels:
            raise Exception(f"${LOG_LEVEL} is not one of the {available_levels}")

        log_level_value = getattr(logging, LOG_LEVEL)
        logger.setLevel(log_level_value)

    def setup_logging():
        """
        Configures logger for future using inside application
        """

        log_format = os.environ.get(
            "LOG_FORMAT",
            "maestro_agent %(asctime)s %(levelname)s %(module)s.%(funcName)s:%(lineno)s - %(message)s",  # noqa: E501
        )

        formatter = logging.Formatter(fmt=log_format)

        handler = logging.StreamHandler()
        handler.setFormatter(formatter)

        logger = logging.getLogger(DEFAULT_LOGGER_NAME)

        Logger.set_logging_level(logger)

        logger.addHandler(handler)

        Logger.instance = logger

        # Create methods aliases for easy access
        Logger.info = Logger.instance.info
        Logger.error = Logger.instance.error
        Logger.warn = Logger.instance.warn
        Logger.debug = Logger.instance.debug

    def register_maestro_api_logging(agent_id):

        if ENABLE_MAESTRO_API_HANDLER:
            Logger.instance.addHandler(MaestroApiHandler(agent_id=agent_id))
