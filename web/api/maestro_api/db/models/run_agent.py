import mongoengine_goodjson as gj
from mongoengine import StringField, ObjectIdField
from maestro_api.libs.extended.enum import ExtendedEnum
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


class RunAgentStatus(ExtendedEnum):
    PROCESSING = "PROCESSING"  # Bulding assets and preparing to start a test
    RUNNING = "RUNNING"  # Test execution started
    FINISHED = "FINISHED"  # Test execution successfully finished
    ERROR = "ERROR"  # Some error during at any of the following stages happened


class RunAgent(CreatedUpdatedDocumentMixin, gj.Document):
    """
    RunAgent Model stores data related to the particular Run and Agent.
    Model is created to evenually replace run.client_agent_id and run.server_agent_ids.
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
