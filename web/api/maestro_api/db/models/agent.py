from maestro_api.libs.extended.enum import ExtendedEnum
from mongoengine import StringField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import strftime


class AgentStatus(ExtendedEnum):
    """
    Agents sends their status from time to time.
    If Agent stop sending signals about status we consider it as 'UNAVAILABLE'
    """

    CREATING = "CREATING"
    AVAILABLE = "AVAILABLE"
    PROCESSING_EVENT = "PROCESSING_EVENT"
    RUNNING_TEST = "RUNNING_TEST"
    UNAVAILABLE = "UNAVAILABLE"
    DISABLED = "DISABLED"


class Agent(CreatedUpdatedDocumentMixin):
    hostname = StringField(required=True)
    ip = StringField(required=True)
    agent_status = StringField(
        required=True, default=AgentStatus.CREATING.value, choices=AgentStatus.list()
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "hostname": str(self.hostname),
            "ip": self.ip,
            "agent_status": self.agent_status,
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
