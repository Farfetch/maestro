from flask import request, jsonify

from maestro_api.db.models.run import Run
from maestro_api.db.models.run_metric import RunMetric
from maestro_api.db.repo.run_metric import RunMetricRepository
from maestro_api.services.jmeter import JmeterService
from maestro_api.db.aggregator.metrics import MetricsAggregator
from maestro_api.libs.flask.utils import (
    bad_request_response,
    get_obj_or_404,
    jsonify_list_of_docs,
)


class RunMetricController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def create_many(self, run_id, data, user):
        """
        Create list of RunMetric objects and aggregate them by label
        """
        run = get_obj_or_404(Run, id=run_id)

        metrics = JmeterService.format_metrics(data.get("metrics"))

        metric_instances = [
            RunMetric(run_id=run.id, **vars(metric)) for metric in metrics
        ]
        MetricsAggregator().group_and_store_by_label(run_id, metric_instances)

        RunMetric.objects.insert(metric_instances)

        return jsonify({"metrics_count": len(metrics)})

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
