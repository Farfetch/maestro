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
    hosts = ListField(field=EmbeddedDocumentField(RunHosts), default=[])
    custom_data_ids = ListField(field=ObjectIdField(), default=[])
    custom_properties = ListField(
        field=EmbeddedDocumentField(RunCustomProperty), default=[]
    )
    load_profile = ListField(field=EmbeddedDocumentField(RunLoadProfile), default=[])
