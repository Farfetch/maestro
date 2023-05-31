from enum import Enum
import dateutil.parser
from maestro_agent.services.maestro_api import MaestroApiClient


class AgentStatus(Enum):
    CREATING = "CREATING"
    AVAILABLE = "AVAILABLE"
    PROCESSING_EVENT = "PROCESSING_EVENT"
    RUNNING_TEST = "RUNNING_TEST"
    UNAVAILABLE = "UNAVAILABLE"


class Agent:
    def __init__(self, id, agent_status, ip, hostname, created_at, updated_at):
        self.id = id
        self.agent_status = agent_status
        self.ip = ip
        self.hostname = hostname
        self.created_at = created_at
        self.updated_at = updated_at


def agent_json_to_object(job_json):
    return Agent(
        id=job_json.get("id"),
        agent_status=job_json.get("agent_status"),
        ip=job_json.get("ip"),
        hostname=job_json.get("hostname"),
        created_at=dateutil.parser.parse(job_json.get("created_at")),
        updated_at=dateutil.parser.parse(job_json.get("updated_at")),
    )


class AgentApi:
    @staticmethod
    def create_or_update(data):
        return MaestroApiClient.put(
            "/api/agent",
            data=data,
            mapper=agent_json_to_object,
        )

    def update_status(agent_id, agent_status):
        return MaestroApiClient.put(
            "/api/agent/%s" % agent_id,
            data={"agent_status": agent_status},
            mapper=agent_json_to_object,
        )

    def get(agent_id):
        return MaestroApiClient.get(
            "/api/agent/%s" % agent_id,
            mapper=agent_json_to_object,
        )
