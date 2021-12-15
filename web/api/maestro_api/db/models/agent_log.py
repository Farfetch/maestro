import mongoengine_goodjson as gj
from mongoengine import ObjectIdField, StringField

from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.extended.enum import ExtendedEnum


class AgentLogLevel(ExtendedEnum):
    """
    Messages log levels received from agents
    """

    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class AgentLog(CreatedUpdatedDocumentMixin, gj.Document):
    agent_id = ObjectIdField(required=True)
    log_message = StringField(required=True)
    level = StringField(
        required=True, default=AgentLogLevel.INFO.value, choices=AgentLogLevel.list()
    )
