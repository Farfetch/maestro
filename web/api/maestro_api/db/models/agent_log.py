from mongoengine import ObjectIdField, StringField

from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.extended.enum import ExtendedEnum
from maestro_api.libs.datetime import strftime


class AgentLogLevel(ExtendedEnum):
    """
    Messages log levels received from agents
    """

    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class AgentLog(CreatedUpdatedDocumentMixin):
    agent_id = ObjectIdField(required=True)
    log_message = StringField(required=True)
    level = StringField(
        required=True, default=AgentLogLevel.INFO.value, choices=AgentLogLevel.list()
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "agent_id": str(self.agent_id),
            "log_message": self.log_message,
            "level": self.level,
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
