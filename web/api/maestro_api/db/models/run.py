import mongoengine_goodjson as gj
from mongoengine import (
    IntField,
    StringField,
    ObjectIdField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
)
from maestro_api.libs.extended.enum import ExtendedEnum
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


class RunStatus(ExtendedEnum):
    CREATING = "CREATING"
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    STOPPED = "STOPPED"
    FINISHED = "FINISHED"


class AgentStatusEnum(ExtendedEnum):
    PROCESSING = "PROCESSING"  # Bulding assets and preparing to start a test
    RUNNING = "RUNNING"  # Test execution started
    FINISHED = "FINISHED"  # Test execution successfully finished
    ERROR = "ERROR"  # Some error during at any of the following stages happened


class RunAgentStatus(EmbeddedDocument):
    agent_id: ObjectIdField(required=True)
    agent_host: StringField(required=True)
    agent_status: StringField(
        required=True,
        default=AgentStatusEnum.PROCESSING.value,
        choices=AgentStatusEnum.list(),
    )
    error_message: StringField()


class RunHosts(EmbeddedDocument):
    host = StringField(required=True)
    ip = StringField(required=True)


class RunCustomProperty(EmbeddedDocument):
    name = StringField(required=True)
    value = StringField(required=True)


class RunLoadProfile(EmbeddedDocument):
    start = IntField(required=True)
    end = IntField(required=True)
    duration = IntField(required=True)


class Run(CreatedUpdatedDocumentMixin, gj.Document):
    title = StringField(required=True)
    run_configuration_id = ObjectIdField(required=True)
    run_status = StringField(
        required=True,
        default=RunStatus.CREATING.value,
        choices=RunStatus.list(),
    )
    run_plan_id = ObjectIdField(required=True)
    client_agent_id = ObjectIdField(required=True)
    server_agent_ids = ListField(
        required=True,
        field=ObjectIdField(),
    )
    agent_statuses = ListField(
        required=True, field=EmbeddedDocumentField(RunAgentStatus)
    )
    hosts = ListField(field=EmbeddedDocumentField(RunHosts), default=[])
    custom_data_ids = ListField(field=ObjectIdField(), default=[])
    custom_properties = ListField(
        field=EmbeddedDocumentField(RunCustomProperty), default=[]
    )
    load_profile = ListField(field=EmbeddedDocumentField(RunLoadProfile), default=[])
