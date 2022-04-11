from enum import Enum

import dateutil.parser

from maestro_cli.services.maestro_api import MaestroApiClient


class RunStatus(Enum):
    PENDING = "PENDING"
    CREATING = "CREATING"
    RUNNING = "RUNNING"
    STOPPED = "STOPPED"
    FINISHED = "FINISHED"
    ERROR = "ERROR"


class RunMetric:
    def __init__(
        self,
        latency_avg,
        latency_p99,
        latency_p95,
        latency_p90,
        latency_p50,
        success_count,
        total_count,
        min_datetime,
        max_datetime,
    ):
        self.latency_avg = latency_avg
        self.latency_p99 = latency_p99
        self.latency_p95 = latency_p95
        self.latency_p90 = latency_p90
        self.latency_p50 = latency_p50
        self.success_count = success_count
        self.total_count = total_count
        self.min_datetime = min_datetime
        self.max_datetime = max_datetime


class RunMetricApi:
    @staticmethod
    def run_metric_json_to_object(json):
        return RunMetric(
            latency_avg=json.get("latency_avg"),
            latency_p99=json.get("latency_p99"),
            latency_p95=json.get("latency_p95"),
            latency_p90=json.get("latency_p90"),
            latency_p50=json.get("latency_p50"),
            success_count=json.get("success_count"),
            total_count=json.get("total_count"),
            min_datetime=dateutil.parser.parse(json.get("min_datetime")),
            max_datetime=dateutil.parser.parse(json.get("max_datetime")),
        )

    @staticmethod
    def all(run_id, time_interval=15):

        return MaestroApiClient.get(
            "/api/run_metrics/%s" % run_id,
            data={"time_interval": time_interval},
            mapper=RunMetricApi.run_metric_json_to_object,
        )
