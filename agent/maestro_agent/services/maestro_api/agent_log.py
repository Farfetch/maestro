import dateutil.parser
from maestro_agent.services.maestro_api import MaestroApiClient


class AgentLog:
    def __init__(self, id, agent_id, log_message, created_at, updated_at):
        self.id = id
        self.agent_id = agent_id
        self.log_message = log_message
        self.created_at = created_at
        self.updated_at = updated_at


def agent_log_json_to_object(job_json):

    return AgentLog(
        id=job_json.get("id"),
        agent_id=job_json.get("agent_id"),
        log_message=job_json.get("log_message"),
        created_at=dateutil.parser.parse(job_json.get("created_at")),
        updated_at=dateutil.parser.parse(job_json.get("updated_at")),
    )


class AgentLogApi:
    @staticmethod
    def send_log_message(agent_id, log_message, level):

        data = dict(agent_id=agent_id, log_message=log_message, level=level)
        return MaestroApiClient.post(
            "/api/agent_log",
            data=data,
            mapper=agent_log_json_to_object,
        )
