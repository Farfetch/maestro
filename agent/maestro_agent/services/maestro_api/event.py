from enum import Enum
import dateutil.parser
from maestro_agent.services.maestro_api import MaestroApiClient


class EventStatus(Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    FINISHED = "FINISHED"


class EventType(Enum):

    START_RUN = "START_RUN"
    STOP_RUN = "STOP_RUN"


class Event:
    def __init__(
        self,
        id,
        event_status,
        event_type,
        agent_id,
        run_id,
        created_at,
        updated_at,
        started_at=None,
        finished_at=None,
    ):
        self.id = id
        self.event_status = event_status
        self.event_type = event_type
        self.agent_id = agent_id
        self.run_id = run_id
        self.started_at = started_at
        self.finished_at = finished_at
        self.created_at = created_at
        self.updated_at = updated_at


def event_json_to_object(event_json):

    return Event(
        id=event_json.get("id"),
        event_status=event_json.get("event_status"),
        event_type=event_json.get("event_type"),
        agent_id=event_json.get("agent_id"),
        run_id=event_json.get("run_id"),
        started_at=dateutil.parser.parse(event_json["started_at"])
        if "started_at" in event_json
        else None,
        finished_at=dateutil.parser.parse(event_json["finished_at"])
        if "finished_at" in event_json
        else None,
        created_at=dateutil.parser.parse(event_json.get("created_at")),
        updated_at=dateutil.parser.parse(event_json.get("updated_at")),
    )


class EventsApi:
    @staticmethod
    def all(data):
        events = MaestroApiClient.get(
            "/api/events",
            data=data,
            mapper=event_json_to_object,
        )

        return events

    @staticmethod
    def update_status(event_id, event_status):
        event = MaestroApiClient.put(
            "/api/event/%s" % event_id,
            data={"event_status": event_status},
            mapper=event_json_to_object,
        )

        return event

    @staticmethod
    def all_to_process(agent_id):
        events = EventsApi.all(
            data={"event_status": EventStatus.PENDING.value, "agent_id": agent_id}
        )

        return events
