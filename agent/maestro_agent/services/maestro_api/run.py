from enum import Enum

import dateutil.parser

from maestro_agent.services.maestro_api import MaestroApiClient


class RunStatus(Enum):
    PENDING = "PENDING"
    CREATING = "CREATING"
    RUNNING = "RUNNING"
    STOPPED = "STOPPED"
    FINISHED = "FINISHED"
    ERROR = "ERROR"


class RunHost:
    def __init__(self, host, ip):

        self.host = host
        self.ip = ip


class RunCustomProperty:
    def __init__(self, name, value):

        self.name = name
        self.value = value


class RunLoadProfile:
    def __init__(self, start, end, duration):

        self.start = start
        self.end = end
        self.duration = duration


class Run:
    def __init__(
        self,
        id,
        run_status,
        run_plan_id,
        agent_ids,
        custom_data_ids,
        hosts,
        load_profile,
        custom_properties,
        created_at,
        updated_at,
    ):
        self.id = id
        self.run_status = run_status
        self.run_plan_id = run_plan_id
        self.agent_ids = agent_ids
        self.custom_data_ids = custom_data_ids
        self.hosts = [
            RunHost(host=host.get("host"), ip=host.get("ip")) for host in hosts
        ]
        self.custom_properties = [
            RunCustomProperty(name=prop.get("name"), value=prop.get("value"))
            for prop in custom_properties
        ]
        self.load_profile = [
            RunLoadProfile(
                start=step.get("start"),
                end=step.get("end"),
                duration=step.get("duration"),
            )
            for step in load_profile
        ]
        self.created_at = created_at
        self.updated_at = updated_at


class RunApi:
    @staticmethod
    def run_json_to_object(json):
        return Run(
            id=json.get("id"),
            run_status=json.get("run_status"),
            run_plan_id=json.get("run_plan_id"),
            agent_ids=json.get("agent_ids"),
            custom_data_ids=json.get("custom_data_ids"),
            hosts=json.get("hosts"),
            custom_properties=json.get("custom_properties"),
            load_profile=json.get("load_profile"),
            created_at=dateutil.parser.parse(json.get("created_at")),
            updated_at=dateutil.parser.parse(json.get("updated_at")),
        )

    @staticmethod
    def get(run_id):

        return MaestroApiClient.get(
            "/api/run/%s" % run_id, mapper=RunApi.run_json_to_object
        )

    @staticmethod
    def update(run_id, run_status):

        return MaestroApiClient.put(
            "/api/run/%s" % run_id,
            data={"run_status": run_status},
            mapper=RunApi.run_json_to_object,
        )

    @staticmethod
    def send_metrics(run_id, metrics):
        MaestroApiClient.post(
            "/api/run_metrics/%s" % run_id,
            data={"metrics": metrics},
        )
