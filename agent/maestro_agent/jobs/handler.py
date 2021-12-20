from maestro_agent.app_state import ApplicationState

from maestro_agent.services.maestro_api.agent import AgentApi
from maestro_agent.logging import Logger


def update_agent_status():
    "Update agent status based on application state"

    agent = ApplicationState.agent
    agent = AgentApi.update_status(
        agent_id=ApplicationState.agent.id, agent_status=agent.agent_status
    )
    Logger.debug(f"agent status updated to {agent.agent_status}")
