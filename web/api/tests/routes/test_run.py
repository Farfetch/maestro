import json

from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.models.run import Run, RunStatus


def test_create_run(client):
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    title = "Example test plan"

    available_in_response = {
        "run_status": RunStatus.CREATING.value,
        "title": title,
        "run_configuration_id": run_configuration_id,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
    }

    RunConfiguration(
        id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
    ).save()

    request_data = {
        "run_configuration_id": run_configuration_id,
    }
    response = client.post(
        "/run",
        data=json.dumps(request_data),
        content_type="application/json",
    )
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert "id" in res_json
    assert "created_at" in res_json
    assert "updated_at" in res_json
    assert available_in_response.items() <= res_json.items()


def test_create_run_with_hosts(client):
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    hosts = [{"host": "test", "ip": "127.0.0.3"}]
    title = "Example test plan"
    load_profile = [{"start": 1, "end": 10, "duration": 5}]
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"

    available_in_response = {
        "title": title,
        "run_configuration_id": run_configuration_id,
        "run_status": RunStatus.CREATING.value,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "hosts": hosts,
        "load_profile": load_profile,
    }

    RunConfiguration(
        id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        load_profile=load_profile,
        hosts=hosts,
    ).save()

    request_data = {
        "run_configuration_id": run_configuration_id,
    }
    response = client.post(
        "/run",
        data=json.dumps(request_data),
        content_type="application/json",
    )
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert "id" in res_json
    assert "created_at" in res_json
    assert "updated_at" in res_json
    assert available_in_response.items() <= res_json.items()


def test_create_test_with_not_found_configuration(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"

    request_data = {
        "run_configuration_id": run_configuration_id,
    }

    response = client.post(
        "/run",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    assert response.status_code == 404


def test_get_run(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    data_to_create = {
        "id": run_id,
        "run_configuration_id": run_configuration_id,
        "title": title,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "run_status": RunStatus.RUNNING.value,
    }

    run = Run(**data_to_create).save()

    response = client.get(
        "/run/%s" % run.id,
    )
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert data_to_create.items() <= res_json.items()


def test_get_run_with_not_found_response(client):
    run_id = "6076d1e3a216ff15b6e95e1f"

    response = client.get("/run/%s" % run_id)

    assert response.status_code == 404


def test_udpate_run_status(client):
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

    run_id = "6076d1e3a216ff15b6e95e1f"
    request_data = {"run_status": RunStatus.RUNNING.value}

    response = client.put(
        "/run/%s" % run_id,
        data=json.dumps(request_data),
        content_type="application/json",
    )

    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert RunStatus.RUNNING.value == res_json["run_status"]


def test_update_run_with_not_found_response(client):
    run_id = "6076d1e3a216ff15b6e95e1f"

    request_data = {"run_status": RunStatus.RUNNING.value}

    response = client.put(
        "/run/%s" % run_id,
        data=json.dumps(request_data),
        content_type="application/json",
    )
    assert response.status_code == 404


def test_list_runs(client):
    "Returns list of test runs from the DB"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    run = Run(
        id=run_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_status=RunStatus.PENDING.value,
    ).save()

    response = client.get("/runs")

    res_json = json.loads(response.data)

    expected_run = {
        "id": str(run.id),
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "run_status": RunStatus.PENDING.value,
        "hosts": [],
    }

    assert len(res_json) == 1
    assert expected_run.items() <= res_json[0].items()


def test_create_run_with_custom_properties(client):
    "Returns single test run when test run with properties created"

    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    custom_properties = [{"name": "testProperty", "value": "123"}]

    available_in_response = {
        "run_status": RunStatus.CREATING.value,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "custom_properties": custom_properties,
    }

    RunConfiguration(
        id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        custom_properties=custom_properties,
    ).save()

    request_data = {
        "run_configuration_id": run_configuration_id,
    }
    response = client.post(
        "/run",
        data=json.dumps(request_data),
        content_type="application/json",
    )
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert "id" in res_json
    assert "created_at" in res_json
    assert "updated_at" in res_json
    assert available_in_response.items() <= res_json.items()


def test_delete_one(client):
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]

    data_to_create = {
        "id": run_id,
        "run_configuration_id": run_configuration_id,
        "title": title,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "run_status": RunStatus.RUNNING.value,
    }

    run = Run(**data_to_create).save()

    response = client.delete(
        "/run/%s" % run.id,
    )
    res_json = json.loads(response.data)
    runs_in_db = Run.objects()

    assert response.status_code == 200
    assert data_to_create.items() <= res_json.items()
    assert 0 <= len(runs_in_db)


def test_run_delete_with_run_not_found(client):
    rund_id = "6326d1e3a216ff15b6e95e9d"

    response = client.delete(
        "/run/%s" % rund_id,
    )

    assert response.status_code == 404