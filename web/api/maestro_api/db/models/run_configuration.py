from mongoengine import (
    BooleanField,
    DateTimeField,
    IntField,
    StringField,
    ObjectIdField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
)
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import strftime


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


class RunConfiguration(CreatedUpdatedDocumentMixin):
    title = StringField(required=True)
    run_plan_id = ObjectIdField(required=True)
    workspace_id = ObjectIdField(required=True)
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

    last_scheduled_at = DateTimeField()

    def to_dict(self):
        return {
            "id": str(self.id),
            "run_plan_id": str(self.run_plan_id),
            "workspace_id": str(self.workspace_id),
            "agent_ids": [str(agent_id) for agent_id in self.agent_ids],
            "custom_data_ids": [
                str(custom_data_id) for custom_data_id in self.custom_data_ids
            ],
            "title": self.title,
            "hosts": [{"host": host.host, "ip": host.ip} for host in self.hosts],
            "custom_properties": [
                {
                    "name": custom_property.name,
                    "value": custom_property.value,
                }
                for custom_property in self.custom_properties
            ],
            "load_profile": [
                {
                    "start": load_step.start,
                    "end": load_step.end,
                    "duration": load_step.duration,
                }
                for load_step in self.load_profile
            ],
            "labels": self.labels,
            "is_schedule_enabled": self.is_schedule_enabled,
            "schedule": {
                "days": [day for day in self.schedule.days],
                "time": self.schedule.time,
            }
            if self.schedule
            else None,
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
