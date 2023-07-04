from mongoengine import (
    BooleanField,
    IntField,
    StringField,
    ObjectIdField,
    DateTimeField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
)
from maestro_api.libs.extended.enum import ExtendedEnum
from maestro_api.libs.datetime import now, strftime
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


class RunStatus(ExtendedEnum):
    PENDING = "PENDING"
    CREATING = "CREATING"
    RUNNING = "RUNNING"
    STOPPED = "STOPPED"
    FINISHED = "FINISHED"
    ERROR = "ERROR"


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


class Run(CreatedUpdatedDocumentMixin):
    title = StringField(required=True)
    run_configuration_id = ObjectIdField(required=True)
    run_status = StringField(
        required=True,
        default=RunStatus.PENDING.value,
        choices=RunStatus.list(),
    )
    run_plan_id = ObjectIdField(required=True)
    workspace_id = ObjectIdField(required=True)

    agent_ids = ListField(
        required=True,
        field=ObjectIdField(),
    )
    hosts = ListField(field=EmbeddedDocumentField(RunHosts), default=[])
    custom_data_ids = ListField(field=ObjectIdField(), default=[])
    custom_properties = ListField(
        field=EmbeddedDocumentField(RunCustomProperty), default=[]
    )
    load_profile = ListField(field=EmbeddedDocumentField(RunLoadProfile), default=[])
    is_load_profile_enabled = BooleanField(default=True)
    notes = StringField(required=True, default="")
    labels = ListField(field=StringField(), default=[])

    started_at = DateTimeField(default=now)
    finished_at = DateTimeField(default=now)

    def update_status(self, run_status):
        self.run_status = run_status
        finished_statuses = [
            RunStatus.FINISHED.value,
            RunStatus.ERROR.value,
            RunStatus.STOPPED.value,
        ]
        started_statuses = [
            RunStatus.PENDING.value,
            RunStatus.CREATING.value,
            RunStatus.RUNNING.value,
        ]

        if run_status in started_statuses:
            self.started_at = now()
            self.finished_at = now()

        if run_status in finished_statuses:
            self.finished_at = now()

        return self

    def to_dict(self):
        return {
            "id": str(self.id),
            "run_configuration_id": str(self.run_configuration_id),
            "run_plan_id": str(self.run_plan_id),
            "workspace_id": str(self.workspace_id),
            "agent_ids": [str(agent_id) for agent_id in self.agent_ids],
            "custom_data_ids": [
                str(custom_data_id) for custom_data_id in self.custom_data_ids
            ],
            "title": self.title,
            "run_status": self.run_status,
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
            "is_load_profile_enabled": self.is_load_profile_enabled,
            "notes": self.notes,
            "labels": self.labels,
            "started_at": strftime(self.started_at),
            "created_at": strftime(self.created_at),
            "finished_at": strftime(self.finished_at),
            "updated_at": strftime(self.updated_at),
        }
