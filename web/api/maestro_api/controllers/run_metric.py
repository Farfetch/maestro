from flask import request, jsonify, send_file

from maestro_api.db.models.run import Run
from maestro_api.db.models.run_metric import RunMetric
from maestro_api.db.repo.run_metric import RunMetricRepository
from maestro_api.services.jmeter import JmeterService
from maestro_api.db.aggregator.metrics import MetricsAggregator
from maestro_api.libs.flask.utils import (
    get_obj_or_404,
)
from maestro_api.libs.csv import CsvBytesIO


class RunMetricController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def create_many(self, run_id, data, user):
        """
        Create list of RunMetric objects and aggregate them by label
        """
        run = get_obj_or_404(Run, id=run_id)

        input_metrics = data.get("metrics")
        jmeter_metrics = JmeterService.format_metrics(input_metrics)

        metric_instances = [
            RunMetric(run_id=run.id, **vars(metric)) for metric in jmeter_metrics
        ]
        MetricsAggregator().group_and_store_by_label(run_id, metric_instances)

        RunMetric.objects.insert(metric_instances)

        return jsonify({"metrics_count": len(jmeter_metrics)})

    def download(self, run_id, data, user):
        """
        Return Jmeter compatible file with Run metrics
        """

        run = get_obj_or_404(Run, id=run_id)

        metrics = RunMetric.objects(run_id=run.id)
        jmeter_metrics = JmeterService.format_to_jmeter_format(metrics)

        headers = [
            "timeStamp",
            "elapsed",
            "label",
            "responseCode",
            "responseMessage",
            "threadName",
            "dataType",
            "success",
            "failureMessage",
            "bytes",
            "sentBytes",
            "grpThreads",
            "allThreads",
            "URL",
            "Latency",
            "IdleTime",
            "Connect",
        ]

        filename = f"metrics_{run.id}.csv"
        content_type = "text/csv"

        binary_file = CsvBytesIO.create_from_dict(headers, jmeter_metrics)

        return (
            send_file(
                binary_file,
                as_attachment=True,
                attachment_filename=filename,
                mimetype=content_type,
            ),
            200,
        )

    def all(self, run_id, data, user):
        """
        Get list of RunMetric objects based on filters
        """
        time_interval = request.args.get("time_interval", type=int, default=15)
        show_labels = request.args.get("show_labels", type=bool, default=False)

        metrics = RunMetricRepository().group_metrics(
            run_id, time_interval, show_labels
        )

        return jsonify(metrics)
