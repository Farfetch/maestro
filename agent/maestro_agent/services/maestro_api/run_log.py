import dateutil.parser

from maestro_agent.services.maestro_api import MaestroApiClient


class RunLog:
    def __init__(self, id, run_id, agent_id, run_logs_file, created_at, updated_at):
        self.id = id
        self.run_id = run_id
        self.agent_id = agent_id
        self.run_logs_file = run_logs_file
        self.created_at = created_at
        self.updated_at = updated_at


class RunLogApi:
    def json_to_object(job_json):

        return RunLog(
            id=job_json.get("id"),
            run_id=job_json.get("run_id"),
            agent_id=job_json.get("agent_id"),
            run_logs_file=job_json.get("run_logs_file"),
            created_at=dateutil.parser.parse(job_json.get("created_at")),
            updated_at=dateutil.parser.parse(job_json.get("updated_at")),
        )

    @staticmethod
    def upload_log_file(run_id, agent_id, run_logs_file):
        data = MaestroApiClient.upload_file(
            url="/api/run_log",
            data={
                "run_id": run_id,
                "agent_id": agent_id,
            },
            files={
                "run_logs_file": run_logs_file,
            },
            mapper=RunLogApi.json_to_object,
        )

        return data
