import json
from datetime import datetime, timedelta

from maestro_api.db.models.run import Run, RunStatus
from maestro_api.db.models.run_metric_label import RunMetricLabel
from maestro_api.db.models.run_metric import RunMetric


def get_metrics(min_datetime, next_datetime):
    return [
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


def test_run_metric_all(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    min_datetime_str = "2019-01-01 10:00:00"

    min_datetime = datetime.strptime(min_datetime_str, "%Y-%m-%d %H:%M:%S")
    next_datetime = datetime.strptime(
        min_datetime_str, "%Y-%m-%d %H:%M:%S"
    ) + timedelta(seconds=11)
    responses = [dict(response_code=200, total_count=1, success_count=1, messages=[])]
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
            responses=responses,
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
            responses=[
                dict(response_code=201, total_count=1, success_count=1, messages=[])
            ],
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
            responses=responses,
            label="Google-2",
        ),
    ]

    Run(
        id=run_id,
        workspace_id=workspace_id,
        title=title,
        run_configuration_id=run_configuration_id,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    for metric in metrics:
        RunMetricLabel(run_id=run_id, **metric).save()

    response = client.get(
        "/run_metrics/%s?time_interval=10" % run_id,
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

    assert [
        {"response_code": 200, "messages": [], "success_count": 0.1, "total_count": 0.1}
    ] == res_json[1].get("responses")

    assert None is res_json[0].get("label")
    assert 75 == res_json[0].get("latency_avg")
    assert 75 == res_json[0].get("latency_p99")
    assert 75 == res_json[0].get("latency_p90")
    assert 75 == res_json[0].get("latency_p95")
    assert 75 == res_json[0].get("latency_p75")
    assert 75 == res_json[0].get("latency_p50")
    assert 0.2 == res_json[0].get("total_count")
    assert 0.2 == res_json[0].get("success_count")

    assert [
        {
            "response_code": 200,
            "messages": [],
            "success_count": 0.1,
            "total_count": 0.1,
        },
        {
            "response_code": 201,
            "messages": [],
            "success_count": 0.1,
            "total_count": 0.1,
        },
    ] == res_json[0].get("responses")


def test_run_metric_all_with_show_labels_param(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    min_datetime_str = "2019-01-01 10:00:00"

    min_datetime = datetime.strptime(min_datetime_str, "%Y-%m-%d %H:%M:%S")
    next_datetime = datetime.strptime(
        min_datetime_str, "%Y-%m-%d %H:%M:%S"
    ) + timedelta(seconds=5)
    metrics = get_metrics(min_datetime, next_datetime)

    Run(
        id=run_id,
        workspace_id=workspace_id,
        title=title,
        run_configuration_id=run_configuration_id,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    for metric in metrics:
        RunMetricLabel(run_id=run_id, **metric).save()

    response = client.get(
        "/run_metrics/%s?show_labels=1" % run_id,
    )

    assert 200 == response.status_code
    res_json = json.loads(response.data)

    assert 2 == len(res_json)
    assert "Google-1" == res_json[0].get("label")
    assert "Google-2" == res_json[1].get("label")


def test_run_metric_all_with_show_labels_and_zero_time_interval(client):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    min_datetime_str = "2019-01-01 10:00:00"

    min_datetime = datetime.strptime(min_datetime_str, "%Y-%m-%d %H:%M:%S")
    next_datetime = datetime.strptime(
        min_datetime_str, "%Y-%m-%d %H:%M:%S"
    ) + timedelta(hours=5)
    metrics = get_metrics(min_datetime, next_datetime)

    Run(
        id=run_id,
        workspace_id=workspace_id,
        title=title,
        run_configuration_id=run_configuration_id,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    for metric in metrics:
        RunMetricLabel(run_id=run_id, **metric).save()

    response = client.get(
        "/run_metrics/%s?show_labels=1&time_interval=0" % run_id,
    )

    assert 200 == response.status_code
    res_json = json.loads(response.data)

    assert 2 == len(res_json)
    assert "Google-1" == res_json[0].get("label")
    assert "Google-2" == res_json[1].get("label")


def test_run_metrics_create_many(client):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    run_id = "6076d1e3a216ff15b6e95e1f"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]

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
        workspace_id=workspace_id,
        title=title,
        run_configuration_id=run_configuration_id,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    request_data = {
        "metrics": [metric_to_store, metric_to_store_with_int],
    }

    response = client.post(
        "/run_metrics/%s" % run_id,
        data=json.dumps(request_data),
        content_type="application/json",
    )

    res_json = json.loads(response.data)

    assert 200 == response.status_code
    assert 2 == res_json["metrics_count"]


def test_run_metrics_download(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    min_datetime_str = "2019-01-01 10:00:00"

    min_datetime = datetime.strptime(min_datetime_str, "%Y-%m-%d %H:%M:%S")
    next_datetime = datetime.strptime(
        min_datetime_str, "%Y-%m-%d %H:%M:%S"
    ) + timedelta(seconds=2)
    default_args = dict(
        elapsed=100,
        label="HTTP Request-1",
        response_code=200,
        response_message="OK",
        thread_name="127.0.0.1-Thread Group 1-1",
        data_type="text",
        success=True,
        failure_message="",
        bytes=10000,
        sent_bytes=110,
        grp_threads=1,
        all_threads=1,
        url="https://www.google.com/",
        idle_time=0,
        connect=104,
    )
    metrics = [
        dict(datetime=min_datetime, latency=50, **default_args),
        dict(datetime=next_datetime, latency=100, **default_args),
    ]

    Run(
        id=run_id,
        workspace_id=workspace_id,
        title=title,
        run_configuration_id=run_configuration_id,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    for metric in metrics:
        RunMetric(run_id=run_id, **metric).save()

    response = client.get(
        "/run_metrics/%s/download" % run_id,
    )
    file_content = (
        "timeStamp,elapsed,label,responseCode,responseMessage,threadName,"
        + "dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,"
        + "Latency,IdleTime,Connect\r\n1546336800000,100,HTTP Request-1,200,OK,"
        + "127.0.0.1-Thread Group 1-1,text,true,,10000,110,1,1,"
        + "https://www.google.com/,50,0,104\r\n1546336802000,100,HTTP Request-1,200,OK,"
        + "127.0.0.1-Thread Group 1-1,text,true,,10000,110,1,1,https://www.google.com/,"
        + "100,0,104\r\n"
    )

    assert 200 == response.status_code
    assert file_content == response.data.decode("utf-8")
