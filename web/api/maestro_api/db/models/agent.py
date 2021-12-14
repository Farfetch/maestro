from maestro_api.libs.extended.enum import ExtendedEnum
import mongoengine_goodjson as gj
from mongoengine import StringField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


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


class Agent(CreatedUpdatedDocumentMixin, gj.Document):
    hostname = StringField(required=True)
    ip = StringField(required=True)
    agent_status = StringField(
        required=True, default=AgentStatus.CREATING.value, choices=AgentStatus.list()
    )
