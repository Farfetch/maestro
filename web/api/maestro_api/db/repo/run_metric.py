from bson.objectid import ObjectId

from maestro_api.libs.datetime import strftime
from maestro_api.db.models.run_metric_label import RunMetricLabel

from maestro_api.libs.utils import round_avg


class RunMetricRepository:
    """
    RunMetric repository
    Stores reusable queries over metrics tahty can be reused accross the project
    """

    def group_responses(self, metrics, time_interval):
        response_codes = {}

        for metric in metrics:

            for response in metric:
                response_code = response["response_code"]
                if response_code not in response_codes:
                    response_codes[response_code] = {
                        "response_code": response_code,
                        "total_count": 0,
                        "success_count": 0,
                        "messages": set(),
                    }

                response_codes[response_code]["total_count"] += response["total_count"]
                response_codes[response_code]["success_count"] += response[
                    "success_count"
                ]
                response_codes[response_code]["messages"] = response_codes[
                    response_code
                ]["messages"].union(response["messages"])

        responses_list = []
        for code in response_codes:
            responses_list_item = {
                "response_code": code,
                "total_count": round_avg(
                    response_codes[code]["total_count"], time_interval
                ),
                "success_count": round_avg(
                    response_codes[code]["success_count"], time_interval
                ),
                "messages": list(response_codes[code]["messages"]),
            }
            responses_list.append(responses_list_item)

        return responses_list

    def group_metrics(self, run_id, time_interval, show_labels):
        """
        Group metric based on `run_id`, `time_interval`, `show_labels`
        `run_id` - Filter metrics for specific run
        `time_interval` - Group metrics by passed amout of seconds. Can have int values
            from 0 to 60. Grouping will be disabled once the value is '0'
        `show_labels` - Group metric by label. If this property not set 'label'
            will be set to None
        """
        match = {
            "run_id": ObjectId(run_id),
        }

        group_id = {
            "year": {"$year": "$datetime"},
            "dayOfYear": {"$dayOfYear": "$datetime"},
            "hour": {"$hour": "$datetime"},
            "minute": {"$minute": "$datetime"},
            "interval": {
                "$subtract": [
                    {"$second": "$datetime"},
                    {"$mod": [{"$second": "$datetime"}, time_interval]},
                ]
            },
        }
        group = {
            "_id": group_id,
            "latency_avg": {"$avg": "$latency_avg"},
            "latency_p99": {"$avg": "$latency_p99"},
            "latency_p95": {"$avg": "$latency_p95"},
            "latency_p90": {"$avg": "$latency_p90"},
            "latency_p75": {"$avg": "$latency_p75"},
            "latency_p50": {"$avg": "$latency_p50"},
            "min_datetime": {"$min": "$datetime"},
            "max_datetime": {"$max": "$datetime"},
            "success_count": {"$sum": "$success_count"},
            "total_count": {"$sum": "$total_count"},
            "responses": {"$push": "$responses"},
        }

        if show_labels:
            if time_interval == 0:
                group["_id"] = {"label": "$label"}
            else:
                group["_id"]["label"] = "$label"
        else:
            group["_id"] = {}
        metrics_query = RunMetricLabel.objects.aggregate(
            [
                {"$match": match},
                {"$group": group},
            ],
            allowDiskUse=True,
        )

        metrics = []
        for metric in list(metrics_query):
            new_metric = {
                "label": metric["_id"]["label"] if show_labels else None,
                "latency_avg": round(metric["latency_avg"], 2),
                "latency_p99": round(metric["latency_p99"], 2),
                "latency_p95": round(metric["latency_p95"], 2),
                "latency_p90": round(metric["latency_p90"], 2),
                "latency_p75": round(metric["latency_p75"], 2),
                "latency_p50": round(metric["latency_p50"], 2),
                "min_datetime": strftime(metric["min_datetime"]),
                "max_datetime": strftime(metric["max_datetime"]),
                # Counts should be devided by interval as shown as metric per sec
                "success_count": round_avg(metric["success_count"], time_interval),
                "total_count": round_avg(metric["total_count"], time_interval),
                "responses": self.group_responses(metric["responses"], time_interval),
            }
            metrics.append(new_metric)

        return metrics
