import mongoengine_goodjson as gj
from mongoengine import (
    IntField,
    StringField,
    ObjectIdField,
    DateTimeField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
)
from maestro_api.libs.extended.enum import ExtendedEnum
from maestro_api.libs.datetime import now
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


class Run(CreatedUpdatedDocumentMixin, gj.Document):
    title = StringField(required=True)
    run_configuration_id = ObjectIdField(required=True)
    run_status = StringField(
        required=True,
        default=RunStatus.PENDING.value,
        choices=RunStatus.list(),
    )
    run_plan_id = ObjectIdField(required=True)

    client_agent_id = ObjectIdField(required=True)  # DEPRECATED
    server_agent_ids = ListField(
        required=True,
        field=ObjectIdField(),
    )  # DEPRECATED
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
