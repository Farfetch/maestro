import json
import pytest
from maestro_api.db.models.run import Run, RunStatus
from maestro_api.db.models.run_metric_label import RunMetricLabel
from maestro_api.db.models.run_metric import RunMetric
from maestro_api.db.models.run_agent import RunAgent, RunAgentStatus
from maestro_api.db.models.event import EventType


def test_run_status_start(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
    ).save()

    response = client.post("/run_status/%s/start" % run_id)

    res_json = json.loads(response.data)

    client_agent_event = {
        "event_type": EventType.START_RUN.value,
        "run_id": run_id,
        "agent_id": client_agent_id,
    }

    server_agent_event = {
        "event_type": EventType.START_SERVER_AGENT.value,
        "run_id": run_id,
        "agent_id": server_agent_ids[0],
    }

    assert len(res_json) == 2
    assert server_agent_event.items() <= res_json[0].items()
    assert client_agent_event.items() <= res_json[1].items()


@pytest.mark.parametrize(
    "run_status",
    [RunStatus.FINISHED.value, RunStatus.STOPPED.value, RunStatus.ERROR.value],
)
def test_run_status_restart(client, run_status):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        run_status=run_status,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
    ).save()

    response = client.post("/run_status/%s/restart" % run_id)

    res_json = json.loads(response.data)

    client_agent_event = {
        "event_type": EventType.START_RUN.value,
        "run_id": run_id,
        "agent_id": client_agent_id,
    }

    server_agent_event = {
        "event_type": EventType.START_SERVER_AGENT.value,
        "run_id": run_id,
        "agent_id": server_agent_ids[0],
    }

    assert len(res_json) == 2
    assert server_agent_event.items() <= res_json[0].items()
    assert client_agent_event.items() <= res_json[1].items()


@pytest.mark.parametrize(
    "run_status",
    [RunStatus.CREATING.value, RunStatus.PENDING.value, RunStatus.RUNNING.value],
)
def test_run_status_restart_with_bad_request(client, run_status):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=run_status,
    ).save()

    response = client.post("/run_status/%s/restart" % run_id)
    response_text = response.data.decode("utf-8")

    assert 400 == response.status_code
    assert (
        "Run status should be one of ['FINISHED', 'STOPPED', 'ERROR']" == response_text
    )


def test_run_status_restart_with_reset_to_default_fields(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    diff_run_id = "6076d1e3a216ff15b6e95e2f"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_id = "6076d1e3a216ff15b6e95e1d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        run_status=RunStatus.FINISHED.value,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
    ).save()
    RunMetricLabel(run_id=diff_run_id).save()
    RunMetricLabel(run_id=run_id).save()
    RunMetric(run_id=diff_run_id).save()
    RunMetric(run_id=run_id).save()
    RunAgent(
        run_id=run_id,
        agent_id=agent_id,
        agent_status=RunAgentStatus.FINISHED.value,
        error_message="some error message",
        agent_hostname="agent.maestro.net",
    ).save()

    RunAgent(
        run_id=diff_run_id,
        agent_id=agent_id,
        agent_status=RunAgentStatus.FINISHED.value,
        agent_hostname="agent.maestro.net",
    ).save()

    client.post("/run_status/%s/restart" % run_id)

    run_metric_labels = RunMetricLabel.objects()
    run_metrics = RunMetric.objects()
    run_agents = RunAgent.objects()
    updated_run = Run.objects.get(id=run_id)

    assert 1 == len(run_metrics)
    assert 1 == len(run_metric_labels)
    assert 2 == len(run_agents)
    assert RunAgentStatus.PROCESSING.value == run_agents[0].agent_status
    assert "" == run_agents[0].error_message
    assert RunAgentStatus.FINISHED.value == run_agents[1].agent_status
    assert RunStatus.PENDING.value == updated_run.run_status


def test_run_status_start_with_running_status(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    response = client.post("/run_status/%s/start" % run_id)
    response_text = response.data.decode("utf-8")

    assert 400 == response.status_code
    assert "Run status should be one of ['PENDING']" == response_text


def test_run_status_stop(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    response = client.post("/run_status/%s/stop" % run_id)

    res_json = json.loads(response.data)

    client_agent_event = {
        "event_type": EventType.STOP_RUN.value,
        "run_id": run_id,
        "agent_id": client_agent_id,
    }

    server_agent_event = {
        "event_type": EventType.STOP_SERVER_AGENT.value,
        "run_id": run_id,
        "agent_id": server_agent_ids[0],
    }

    assert len(res_json) == 2
    assert server_agent_event.items() <= res_json[0].items()
    assert client_agent_event.items() <= res_json[1].items()


@pytest.mark.parametrize(
    "run_status",
    [RunStatus.FINISHED.value, RunStatus.STOPPED.value, RunStatus.ERROR.value],
)
def test_run_status_stop_with_bad_request_response(client, run_status):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=run_status,
    ).save()

    response = client.post("/run_status/%s/stop" % run_id)

    response_text = response.data.decode("utf-8")

    assert 400 == response.status_code
    assert (
        "Run status should be one of ['PENDING', 'CREATING', 'RUNNING']"
        == response_text
    )


def test_run_status_finish(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=RunStatus.RUNNING.value,
    ).save()

    response = client.post("/run_status/%s/finish" % run_id)

    res_json = json.loads(response.data)

    server_agent_event = {
        "event_type": EventType.STOP_SERVER_AGENT.value,
        "run_id": run_id,
        "agent_id": server_agent_ids[0],
    }

    updated_run = Run.objects.get(id=run_id)

    assert len(res_json) == 1
    assert server_agent_event.items() <= res_json[0].items()
    assert RunStatus.FINISHED.value == updated_run.run_status


def test_run_status_finish_bad_response_for_not_running_runs(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=RunStatus.PENDING.value,
    ).save()

    response = client.post("/run_status/%s/finish" % run_id)

    response_text = response.data.decode("utf-8")

    assert 400 == response.status_code
    assert "Run status should be one of ['RUNNING']" == response_text


def test_run_finish_no_found_error(client):
    run_id = "6076d1e3a216ff15b6e95e1f"

    response = client.post("/run/%s/finish" % run_id)

    assert 404 == response.status_code