from mongoengine import StringField, ObjectIdField
from maestro_api.libs.extended.enum import ExtendedEnum
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import strftime


class RunAgentStatus(ExtendedEnum):
    PROCESSING = "PROCESSING"  # Bulding assets and preparing to start a test
    RUNNING = "RUNNING"  # Test execution started
    FINISHED = "FINISHED"  # Test execution successfully finished
    ERROR = "ERROR"  # Some error during at any of the following stages happened


class RunAgent(CreatedUpdatedDocumentMixin):
    """
    RunAgent Model stores data related to the particular Run and Agent.
    Model might eventually replace usage of run.agent_ids field.
    """

    run_id = ObjectIdField(required=True)
    agent_id = ObjectIdField(required=True)
    agent_hostname = StringField(required=True)
    agent_status = StringField(
        required=True,
        default=RunAgentStatus.PROCESSING.value,
        choices=RunAgentStatus.list(),
    )
    error_message = StringField(default="")

    def to_dict(self):
        return {
            "id": str(self.id),
            "run_id": str(self.run_id),
            "agent_id": str(self.agent_id),
            "agent_hostname": self.agent_hostname,
            "agent_status": self.agent_status,
            "error_message": str(self.error_message),
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
