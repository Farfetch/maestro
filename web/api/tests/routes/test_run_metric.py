import json
from datetime import datetime, timedelta

from maestro_api.db.models.run import Run, RunStatus
from maestro_api.db.models.run_metric import RunMetric
from maestro_api.db.models.run_metric_label import RunMetricLabel


def test_run_metric_all(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    min_datetime_str = "2019-01-01 10:00:00"

    min_datetime = datetime.strptime(min_datetime_str, "%Y-%m-%d %H:%M:%S")
    next_datetime = datetime.strptime(
        min_datetime_str, "%Y-%m-%d %H:%M:%S"
    ) + timedelta(seconds=11)
    metrics = [
        dict(
            datetime=min_datetime,
            latency_avg=50,
            latency_p99=50,
            latency_p90=50,
            latency_p95=50,
            latency_p75=50,
            latency_p50=50,
            total_count=1,
            success_count=1,
            label="Google-1",
        ),
        dict(
            datetime=min_datetime,
            latency_avg=100,
            latency_p99=100,
            latency_p90=100,
            latency_p95=100,
            latency_p75=100,
            latency_p50=100,
            total_count=1,
            success_count=1,
            label="Google-1",
        ),
        dict(
            datetime=next_datetime,
            latency_avg=50,
            latency_p99=50,
            latency_p90=50,
            latency_p95=50,
            latency_p75=50,
            latency_p50=50,
            total_count=1,
            success_count=1,
            label="Google-2",
        ),
    ]

    Run(
        id=run_id,
        title=title,
        run_configuration_id=run_configuration_id,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    for metric in metrics:
        RunMetricLabel(run_id=run_id, **metric).save()

    response = client.get(
        "/run_metric/%s?time_interval=10" % run_id,
    )

    assert 200 == response.status_code
    res_json = json.loads(response.data)

    assert 2 == len(res_json)
    assert None is res_json[1].get("label")
    assert 50 == res_json[1].get("latency_avg")
    assert 50 == res_json[1].get("latency_p99")
    assert 50 == res_json[1].get("latency_p90")
    assert 50 == res_json[1].get("latency_p95")
    assert 50 == res_json[1].get("latency_p75")
    assert 50 == res_json[1].get("latency_p50")
    assert 0.1 == res_json[1].get("total_count")
    assert 0.1 == res_json[1].get("success_count")

    assert None is res_json[0].get("label")
    assert 75 == res_json[0].get("latency_avg")
    assert 75 == res_json[0].get("latency_p99")
    assert 75 == res_json[0].get("latency_p90")
    assert 75 == res_json[0].get("latency_p95")
    assert 75 == res_json[0].get("latency_p75")
    assert 75 == res_json[0].get("latency_p50")
    assert 0.2 == res_json[0].get("total_count")
    assert 0.2 == res_json[0].get("success_count")


def test_run_metric_all_with_show_labels_param(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    min_datetime_str = "2019-01-01 10:00:00"

    min_datetime = datetime.strptime(min_datetime_str, "%Y-%m-%d %H:%M:%S")
    next_datetime = datetime.strptime(
        min_datetime_str, "%Y-%m-%d %H:%M:%S"
    ) + timedelta(seconds=5)
    metrics = [
        dict(
            datetime=min_datetime,
            latency_avg=50,
            latency_p99=50,
            latency_p90=50,
            latency_p95=50,
            latency_p75=50,
            latency_p50=50,
            total_count=1,
            success_count=1,
            label="Google-1",
        ),
        dict(
            datetime=next_datetime,
            latency_avg=50,
            latency_p99=50,
            latency_p90=50,
            latency_p95=50,
            latency_p75=50,
            latency_p50=50,
            total_count=1,
            success_count=1,
            label="Google-2",
        ),
    ]

    Run(
        id=run_id,
        title=title,
        run_configuration_id=run_configuration_id,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    for metric in metrics:
        RunMetricLabel(run_id=run_id, **metric).save()

    response = client.get(
        "/run_metric/%s?show_labels=1" % run_id,
    )

    assert 200 == response.status_code
    res_json = json.loads(response.data)

    assert 2 == len(res_json)
    assert "Google-1" == res_json[0].get("label")
    assert "Google-2" == res_json[1].get("label")


def test_run_metrics_create_many(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    run_id = "6076d1e3a216ff15b6e95e1f"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    metric_to_store = dict(
        timeStamp=1633708363609,
        elapsed="",
        label="HTTP Request-1",
        responseCode="",
        responseMessage="OK",
        threadName="127.0.0.1-Thread Group 1-1",
        dataType="",
        success="true",
        failureMessage="",
        bytes="",
        sentBytes="",
        grpThreads="",
        allThreads="",
        URL="null",
        Latency="",
        IdleTime="",
        Connect="",
    )
    metric_to_store_with_int = dict(
        timeStamp=1633708363609,
        elapsed="100",
        label="HTTP Request-1",
        responseCode="200",
        responseMessage="OK",
        threadName="127.0.0.1-Thread Group 1-1",
        dataType="text",
        success="true",
        failureMessage="",
        bytes="500",
        sentBytes="150",
        grpThreads="1",
        allThreads="1",
        URL="https://google.com",
        Latency="800",
        IdleTime="100",
        Connect="50",
    )

    Run(
        id=run_id,
        title=title,
        run_configuration_id=run_configuration_id,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    request_data = {
        "metrics": [metric_to_store, metric_to_store_with_int],
    }

    response = client.post(
        "/run_metric/%s" % run_id,
        data=json.dumps(request_data),
        content_type="application/json",
    )

    res_json = json.loads(response.data)

    assert 200 == response.status_code
    assert 2 == res_json["metrics_count"]
