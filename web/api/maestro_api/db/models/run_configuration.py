import mongoengine_goodjson as gj
from mongoengine import (
    IntField,
    StringField,
    ObjectIdField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
)
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


class RunConfigurationHosts(EmbeddedDocument):
    host = StringField(required=True)
    ip = StringField(required=True)


class RunConfigurationCustomProperty(EmbeddedDocument):
    name = StringField(required=True)
    value = StringField(required=True)


class RunConfigurationLoadProfile(EmbeddedDocument):
    start = IntField(required=True)
    end = IntField(required=True)
    duration = IntField(required=True)


class RunConfiguration(CreatedUpdatedDocumentMixin, gj.Document):
    title = StringField(required=True)
    run_plan_id = ObjectIdField(required=True)
    client_agent_id = ObjectIdField(required=True)
    server_agent_ids = ListField(
        required=True,
        field=ObjectIdField(),
    )
    hosts = ListField(field=EmbeddedDocumentField(RunConfigurationHosts), default=[])
    custom_data_ids = ListField(field=ObjectIdField(), default=[])
    custom_properties = ListField(
        field=EmbeddedDocumentField(RunConfigurationCustomProperty), default=[]
    )
    load_profile = ListField(
        field=EmbeddedDocumentField(RunConfigurationLoadProfile), default=[]
    )
