from datetime import datetime
from maestro_api.libs.extended.enum import ExtendedEnum
import mongoengine_goodjson as gj
from mongoengine import StringField, DateTimeField, ObjectIdField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


class EventStatus(ExtendedEnum):
    """
    The status is responsible to have general control over events and have
    distributed event based system
    """

    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    FINISHED = "FINISHED"


class EventType(ExtendedEnum):
    """
    Based on this list of types we running specific logic on the agent side.
    Some of the events also can be generated on the maestro client agent in order
    to communicate to other server agents
    """

    START_RUN = "START_RUN"
    RESTART_RUN = "RESTART_RUN"
    STOP_RUN = "STOP_RUN"
    START_SERVER_AGENT = "START_SERVER_AGENT"
    RESTART_SERVER_AGENT = "RESTART_SERVER_AGENT"
    STOP_SERVER_AGENT = "STOP_SERVER_AGENT"


class Event(CreatedUpdatedDocumentMixin, gj.Document):
    event_status = StringField(
        default=EventStatus.PENDING.value,
        required=True,
        choices=EventStatus.list(),
    )
    event_type = StringField(
        required=True,
        choices=EventType.list(),
    )
    agent_id = ObjectIdField(required=True)

    started_at = DateTimeField()
    finished_at = DateTimeField()

    # Additional params that are based on the event_type.
    run_id = ObjectIdField()

    def save(self, *args, **kwargs):
        if self.event_status == EventStatus.PROCESSING.value:
            self.started_at = datetime.now()

        if self.event_status == EventStatus.FINISHED.value:
            self.finished_at = datetime.now()

        return super(Event, self).save(*args, **kwargs)
