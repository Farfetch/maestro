import json


from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run_plan import RunPlan
from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.models.custom_data import CustomData


def test_create_run_configuration(client):
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_plan_title = "Example test plan"
    run_configuration_title = "Example test plan"
    hosts = [{"host": "test", "ip": "127.0.0.3"}]
    custom_properties = [{"name": "testProperty", "value": "123"}]
    custom_data_ids = ["6086d152b28b871d6bdb604f"]
    load_profile = [{"start": 1, "end": 10, "duration": 5}]
    labels = ["label1", "label2"]

    available_in_response = {
        "title": run_configuration_title,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "custom_properties": custom_properties,
        "hosts": hosts,
        "custom_data_ids": custom_data_ids,
        "load_profile": load_profile,
        "labels": labels,
    }

    Agent(id=client_agent_id, hostname="test", ip="test_ip").save()
    RunPlan(id=run_plan_id, title=run_plan_title).save()
    for server_agent_id in server_agent_ids:
        Agent(
            id=server_agent_id, hostname="host_%s" % server_agent_id, ip="test_ip"
        ).save()
    for custom_data_id in custom_data_ids:
        CustomData(id=custom_data_id, name="test.csv").save()

    request_data = {
        "title": run_configuration_title,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "custom_properties": custom_properties,
        "hosts": hosts,
        "custom_data_ids": custom_data_ids,
        "load_profile": load_profile,
        "labels": labels,
    }
    response = client.post(
        "/run_configuration",
        data=json.dumps(request_data),
        content_type="application/json",
    )
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert "id" in res_json
    assert "created_at" in res_json
    assert "updated_at" in res_json
    assert available_in_response.items() <= res_json.items()


def test_create_run_configuration_required_params_only(client):
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_plan_title = "Example test plan"
    run_configuration_title = "Example test plan"

    available_in_response = {
        "title": run_configuration_title,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "custom_properties": [],
        "hosts": [],
        "custom_data_ids": [],
    }

    Agent(id=client_agent_id, hostname="test", ip="test_ip").save()
    RunPlan(id=run_plan_id, title=run_plan_title).save()
    for server_agent_id in server_agent_ids:
        Agent(
            id=server_agent_id, hostname="host_%s" % server_agent_id, ip="test_ip"
        ).save()

    request_data = {
        "title": run_configuration_title,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
    }
    response = client.post(
        "/run_configuration",
        data=json.dumps(request_data),
        content_type="application/json",
    )
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert "id" in res_json
    assert "created_at" in res_json
    assert "updated_at" in res_json
    assert available_in_response.items() <= res_json.items()


def test_update_run_configuration(client):
    run_configuration_id = "6106d1e3a216ff15b6e95e9d"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_plan_title = "Example test plan"
    run_configuration_title = "Example test plan"
    hosts = [{"host": "test", "ip": "127.0.0.3"}]
    custom_properties = [{"name": "testProperty", "value": "123"}]
    load_profile = [{"start": 1, "end": 10, "duration": 5}]
    labels = ["label1", "label2"]

    available_in_response = {
        "title": run_configuration_title,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "custom_properties": custom_properties,
        "hosts": hosts,
        "custom_data_ids": [],
        "load_profile": load_profile,
        "labels": labels,
    }

    Agent(id=client_agent_id, hostname="test", ip="test_ip").save()
    RunPlan(id=run_plan_id, title=run_plan_title).save()
    for server_agent_id in server_agent_ids:
        Agent(
            id=server_agent_id, hostname="host_%s" % server_agent_id, ip="test_ip"
        ).save()

    RunConfiguration(
        id=run_configuration_id,
        title=run_configuration_title,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_plan_id=run_plan_id,
        hosts=[],
        custom_data_ids=[],
        custom_properties=[],
        load_profile=[],
        labels=["label1"],
    ).save()

    request_data = {
        "title": run_configuration_title,
        "run_plan_id": run_plan_id,
        "client_agent_id": client_agent_id,
        "server_agent_ids": server_agent_ids,
        "custom_properties": custom_properties,
        "hosts": hosts,
        "custom_data_ids": [],
        "load_profile": load_profile,
    }
    response = client.put(
        f"/run_configuration/{run_configuration_id}",
        data=json.dumps(request_data),
        content_type="application/json",
    )
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert "id" in res_json
    assert "created_at" in res_json
    assert "updated_at" in res_json
    assert available_in_response.items() <= res_json.items()


def test_delete_run_configuration(client):
    run_configuration_id = "6106d1e3a216ff15b6e95e9d"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_configuration_title = "Example test plan"

    RunConfiguration(
        id=run_configuration_id,
        title=run_configuration_title,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_plan_id=run_plan_id,
        hosts=[],
        custom_data_ids=[],
        custom_properties=[],
    ).save()

    request_data = {}
    response = client.delete(
        f"/run_configuration/{run_configuration_id}",
        data=json.dumps(request_data),
        content_type="application/json",
    )
    available_run_configurations = RunConfiguration.objects()
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert res_json["id"] == run_configuration_id

    assert len(available_run_configurations) == 0


def test_delete_run_configuration_with_not_found(client):
    run_configuration_id = "6106d1e3a216ff15b6e95e9d"

    request_data = {}
    response = client.delete(
        f"/run_configuration/{run_configuration_id}",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    assert response.status_code == 404


def test_get_run_configuration(client):
    run_configuration_id = "6106d1e3a216ff15b6e95e9d"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_configuration_title = "Example test plan"
    hosts = [{"host": "test", "ip": "127.0.0.3"}]
    custom_properties = [{"name": "testProperty", "value": "123"}]
    load_profile = [{"start": 1, "end": 10, "duration": 5}]

    RunConfiguration(
        id=run_configuration_id,
        title=run_configuration_title,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_plan_id=run_plan_id,
        hosts=hosts,
        custom_data_ids=[],
        custom_properties=custom_properties,
        load_profile=load_profile,
    ).save()

    response = client.get(
        f"/run_configuration/{run_configuration_id}",
    )
    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert "created_at" in res_json
    assert "updated_at" in res_json
    assert res_json["id"] == run_configuration_id
    assert res_json["title"] == run_configuration_title
    assert res_json["run_plan_id"] == run_plan_id
    assert res_json["client_agent_id"] == client_agent_id
    assert res_json["server_agent_ids"] == server_agent_ids
    assert res_json["custom_properties"] == custom_properties
    assert res_json["hosts"] == hosts
    assert res_json["custom_data_ids"] == []
    assert res_json["load_profile"] == load_profile


def test_get_run_configuration_with_not_found(client):
    run_configuration_id = "6106d1e3a216ff15b6e95e9d"

    response = client.get(
        f"/run_configuration/{run_configuration_id}",
    )

    assert response.status_code == 404


def test_list_run_configurations(client):
    run_configuration_id = "6106d1e3a216ff15b6e95e9d"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    client_agent_id = "6076d152b28b871d6bdb604f"
    server_agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_configuration_title = "Example test plan"
    hosts = [{"host": "test", "ip": "127.0.0.3"}]
    custom_properties = [{"name": "testProperty", "value": "123"}]

    RunConfiguration(
        id=run_configuration_id,
        title=run_configuration_title,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        run_plan_id=run_plan_id,
        hosts=hosts,
        custom_data_ids=[],
        custom_properties=custom_properties,
    ).save()

    response = client.get(
        "/run_configurations",
    )
    res_json = json.loads(response.data)
    item = res_json[0]

    assert response.status_code == 200
    assert len(res_json) == 1

    assert "created_at" in item
    assert "updated_at" in item
    assert item["id"] == run_configuration_id
    assert item["title"] == run_configuration_title
    assert item["run_plan_id"] == run_plan_id
    assert item["client_agent_id"] == client_agent_id
    assert item["server_agent_ids"] == server_agent_ids
    assert item["custom_properties"] == custom_properties
    assert item["hosts"] == hosts
    assert item["custom_data_ids"] == []
