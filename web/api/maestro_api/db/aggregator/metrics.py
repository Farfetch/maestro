from datetime import datetime
import numpy

from maestro_api.db.models.run_metric_label import RunMetricLabel

from maestro_api.libs.datetime import DEFAULT_DATTETIME_FORMAT
from maestro_api.libs.utils import chunks


class MetricsAggregator:
    """
    Raw metrics aggregator to group metrics by second and store in run_metric
    collection.

    `group_and_store_by_label` - aggregates RunMetric objects and
        stores them separately to RunMetricLabel collection
    """

    INSERT_BULK = 100000

    def group_by_label_date(self, metrics):
        metrics_by_date = {}

        for metric in metrics:
            datetime_str = metric.datetime.strftime(DEFAULT_DATTETIME_FORMAT)
            label = metric.label

            if label not in metrics_by_date:
                metrics_by_date[label] = {}

            if datetime_str not in metrics_by_date[label]:
                metrics_by_date[label][datetime_str] = []

            metrics_by_date[label][datetime_str].append(metric)

        return metrics_by_date

    def group_responses(self, metrics):
        response_codes = {}

        for metric in metrics:
            response_code = metric.response_code if metric.response_code else 0

            if response_code not in response_codes:
                response_codes[response_code] = {
                    "response_code": response_code,
                    "total_count": 0,
                    "success_count": 0,
                    "messages": set(),
                }

            response_codes[response_code]["total_count"] += 1
            response_codes[response_code]["success_count"] += 1 if metric.success else 0
            response_codes[response_code]["messages"].add(metric.response_message)

        responses_list = [response_codes[code] for code in response_codes]

        return responses_list

    def group_and_store_by_label(self, run_id, run_metrics):
        """
        Group received RunMetric objects based on `label`, `seconds` and insert
        to `run_metric_label` collection.
        """
        metrics_by_date = self.group_by_label_date(run_metrics)

        run_metric_labels = []
        for label in metrics_by_date:
            for date in metrics_by_date[label]:
                date_metrics = metrics_by_date[label][date]

                latencies = [
                    metric.latency
                    for metric in date_metrics
                    if metric.latency is not None
                ]
                responses = self.group_responses(date_metrics)
                metric_datetime = datetime.strptime(date, DEFAULT_DATTETIME_FORMAT)

                total_count = len(date_metrics)
                success_count = sum([metric.success for metric in date_metrics])
                latency_p99 = round(numpy.percentile(latencies, 99), 2)
                latency_p95 = round(numpy.percentile(latencies, 95), 2)
                latency_p90 = round(numpy.percentile(latencies, 90), 2)
                latency_p75 = round(numpy.percentile(latencies, 75), 2)
                latency_p50 = round(numpy.percentile(latencies, 50), 2)
                latency_avg = round(numpy.average(latencies), 2)

                run_metric_labels.append(
                    RunMetricLabel(
                        run_id=run_id,
                        datetime=metric_datetime,
                        label=label,
                        total_count=total_count,
                        success_count=success_count,
                        latency_p99=latency_p99,
                        latency_p95=latency_p95,
                        latency_p90=latency_p90,
                        latency_p75=latency_p75,
                        latency_p50=latency_p50,
                        latency_avg=latency_avg,
                        responses=responses,
                    )
                )

        if run_metric_labels:
            for insert_chunk in chunks(run_metric_labels, self.INSERT_BULK):
                RunMetricLabel.objects.insert(insert_chunk)

        return run_metric_labels
