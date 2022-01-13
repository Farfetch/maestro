from maestro_agent.services.maestro_api.event import EventType
from maestro_agent.services.event.handlers import (
    StartRunEventHandler,
    StopRunEventHandler,
    StartServerAgentEventHandler,
    StopServerAgentEventHandler,
)


class EventHandlerFactory:
    def build(event, agent):
        event_type = event.event_type

        if event_type == EventType.START_RUN.value:
            return StartRunEventHandler(event, agent)
        elif event_type == EventType.STOP_RUN.value:
            return StopRunEventHandler(event, agent)
        elif event_type == EventType.START_SERVER_AGENT.value:
            return StartServerAgentEventHandler(event, agent)
        elif event_type == EventType.STOP_SERVER_AGENT.value:
            return StopServerAgentEventHandler(event, agent)
        else:
            raise NotImplementedError("Event type %s is not implemeted" % event_type)
