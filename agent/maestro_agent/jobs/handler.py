from maestro_agent.app_state import ApplicationState
from maestro_agent.jobs.event_types import (
    start_server_agent,
    start_test,
    stop_server_agent,
    stop_test,
)
from maestro_agent.services.maestro_api.agent import AgentApi
from maestro_agent.services.maestro_api.event import EventsApi, EventStatus, EventType
from maestro_agent.logging import Logger


def build_event_type_handler(event):
    event_type = event.event_type

    if event_type == EventType.START_RUN.value:
        return start_test.handler
    elif event_type == EventType.STOP_RUN.value:
        return stop_test.handler
    elif event_type == EventType.START_SERVER_AGENT.value:
        return start_server_agent.handler
    elif event_type == EventType.STOP_SERVER_AGENT.value:
        return stop_server_agent.handler
    else:
        raise NotImplementedError("Event type %s is not implemeted" % event_type)


def handle_new_events():
    """
    Processing events received sent from API.
    Only one event might be executed at particular amout of time
    """
    agent = ApplicationState.agent
    events_to_process = EventsApi.all_to_process(agent_id=agent.id)

    if len(events_to_process) >= 1:
        ApplicationState.processing_event()
        current_event = events_to_process[0]

        EventsApi.update_status(
            event_id=current_event.id, event_status=EventStatus.PROCESSING.value
        )
        Logger.info(
            "Starting processing an event"
            f"event_status={EventStatus.PROCESSING.value}, event_id={current_event.id}"
        )

        try:
            event_handler = build_event_type_handler(current_event)

            event_handler(event=current_event, agent=agent)
            EventsApi.update_status(
                event_id=current_event.id, event_status=EventStatus.FINISHED.value
            )

            Logger.info(
                "Event processing finished. %s,%s"
                % (
                    f"event_status={EventStatus.FINISHED.value}",
                    f"event_id={current_event.id}",
                )
            )
        except Exception as e:
            # TODO: update event status to failing
            Logger.info("Event processing failed. %s" % f"event_id={current_event.id}")
            Logger.error(e)


def update_agent_status():
    "Update agent status based on application state"

    agent = ApplicationState.agent
    agent = AgentApi.update_status(
        agent_id=ApplicationState.agent.id, agent_status=agent.agent_status
    )
    Logger.debug(f"agent status updated to {agent.agent_status}")
