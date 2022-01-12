from enum import Enum
import dateutil.parser
from maestro_agent.services.maestro_api import MaestroApiClient


class RunAgentStatus(Enum):
    PENDING = "PENDING"  # default status. Event hasn't received yet.
    PROCESSING = "PROCESSING"  # Bulding assets and preparing to start a test
    RUNNING = "RUNNING"  # Test execution started
    FINISHED = "FINISHED"  # Test execution successfully finished
    ERROR = "ERROR"  # Some error during at any of the following stages happened


class RunAgent:
    def __init__(
        self,
        id,
        run_id,
        agent_id,
        agent_status,
        agent_hostname,
        error_message,
        created_at,
        updated_at,
    ):
        self.id = id
        self.run_id = run_id
        self.agent_id = agent_id
        self.agent_status = agent_status
        self.agent_hostname = agent_hostname
        self.error_message = error_message
        self.created_at = created_at
        self.updated_at = updated_at


def run_agent_json_to_object(run_agent_json):

    return RunAgent(
        id=run_agent_json.get("id"),
        run_id=run_agent_json.get("run_id"),
        agent_id=run_agent_json.get("agent_id"),
        agent_hostname=run_agent_json.get("agent_hostname"),
        agent_status=run_agent_json.get("agent_status"),
        error_message=run_agent_json.get("error_message"),
        created_at=dateutil.parser.parse(run_agent_json.get("created_at")),
        updated_at=dateutil.parser.parse(run_agent_json.get("updated_at")),
    )


class RunAgentApi:
    def update_status(run_id, agent_id, agent_status, error_message=""):
        return MaestroApiClient.put(
            "/api/run_agent",
            data={
                "run_id": run_id,
                "agent_id": agent_id,
                "agent_status": agent_status,
                "error_message": error_message,
            },
            mapper=run_agent_json_to_object,
        )
