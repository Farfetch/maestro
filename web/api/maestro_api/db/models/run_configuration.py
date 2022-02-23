import mongoengine_goodjson as gj
from mongoengine import (
    BooleanField,
    IntField,
    StringField,
    ObjectIdField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
)
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


class RunConfigurationSchedule(EmbeddedDocument):
    days = ListField(field=StringField(), required=True)
    time = StringField(required=True)


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
    agent_ids = ListField(
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
    labels = ListField(field=StringField(), default=[])

    is_schedule_enabled = BooleanField(default=False)

    schedule = EmbeddedDocumentField(RunConfigurationSchedule)
