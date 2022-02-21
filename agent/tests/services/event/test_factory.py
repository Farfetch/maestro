import dateutil
import pytest
from maestro_agent.services.maestro_api.event import EventType, EventStatus, Event
from maestro_agent.services.maestro_api.agent import Agent, AgentStatus
from maestro_agent.services.event.factory import EventHandlerFactory
from maestro_agent.services.agent.hooks import AgentHooks
from maestro_agent.services.event.handlers import (
    StartRunEventHandler,
    StopRunEventHandler,
)


class TestEventHandlerFactory:
    def get_event(self, event_type):
        id = "some value"
        event_status = EventStatus.PENDING.value
        agent_id = "agent_id_1"
        run_id = "run_id_3"
        created_at = "2021-05-19T17:31:47.560000"
        updated_at = "2021-06-19T17:31:47.560000"

        event = Event(
            id=id,
            event_status=event_status,
            event_type=event_type,
            agent_id=agent_id,
            run_id=run_id,
            created_at=created_at,
            updated_at=updated_at,
        )

        return event

    def get_agent(self):
        agent_id = "agent_id_1"
        created_at = "2021-05-19T17:31:47.560000"
        updated_at = "2021-06-19T17:31:47.560000"
        ip = "127.0.0.4"
        agent_status = AgentStatus.AVAILABLE.value
        hostname = "test.maestro.net"

        agent = Agent(
            id=agent_id,
            hostname=hostname,
            ip=ip,
            agent_status=agent_status,
            created_at=dateutil.parser.parse(created_at),
            updated_at=dateutil.parser.parse(updated_at),
        )

        return agent

    @pytest.mark.parametrize(
        "event_type,instance_class",
        [
            (EventType.START_RUN.value, StartRunEventHandler),
            (EventType.STOP_RUN.value, StopRunEventHandler),
        ],
    )
    def test_build(self, event_type, instance_class):
        event = self.get_event(event_type)
        agent = self.get_agent()

        event_handler = EventHandlerFactory.build(event, agent)

        assert isinstance(event_handler, instance_class)
        assert isinstance(event_handler.agent_hooks, AgentHooks)
        assert agent == event_handler.agent
        assert event == event_handler.event

    def test_build_with_exception(self):
        event = self.get_event("custom_type")
        agent = self.get_agent()

        with pytest.raises(NotImplementedError):
            EventHandlerFactory.build(event, agent)
