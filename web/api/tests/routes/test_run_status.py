import json

from maestro_api.db.models.run import Run, RunStatus
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


def test_run_status_restart(client):
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

    response = client.post("/run_status/%s/restart" % run_id)

    res_json = json.loads(response.data)

    client_agent_event = {
        "event_type": EventType.RESTART_RUN.value,
        "run_id": run_id,
        "agent_id": client_agent_id,
    }

    server_agent_event = {
        "event_type": EventType.RESTART_SERVER_AGENT.value,
        "run_id": run_id,
        "agent_id": server_agent_ids[0],
    }

    assert len(res_json) == 2
    assert server_agent_event.items() <= res_json[0].items()
    assert client_agent_event.items() <= res_json[1].items()


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
    assert "Run status is not 'PENDING'" == response_text


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


def test_run_status_stop_bad_response_for_not_running_runs(client):
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

    response = client.post("/run_status/%s/stop" % run_id)

    response_text = response.data.decode("utf-8")

    assert 400 == response.status_code
    assert "Run status is not '%s'" % RunStatus.RUNNING.value == response_text


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
    assert "Run status is not '%s'" % RunStatus.RUNNING.value == response_text


def test_run_finish_no_found_error(client):
    run_id = "6076d1e3a216ff15b6e95e1f"

    response = client.post("/run/%s/finish" % run_id)

    assert 404 == response.status_code
