import json
import pytest

from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run_plan import RunPlan
from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.models.custom_data import CustomData
from maestro_api.db.models.workspace import Workspace
from maestro_api.enums import DaysOfTheWeek


@pytest.mark.parametrize(
    "optional_params",
    [
        {},
        {"hosts": [{"host": "test", "ip": "127.0.0.3"}]},
        {"custom_properties": [{"name": "testProperty", "value": "123"}]},
        {"load_profile": [{"start": 1, "end": 10, "duration": 5}]},
        {"labels": ["label1", "label2"]},
        {
            "is_schedule_enabled": True,
            "schedule": {"days": [DaysOfTheWeek.Mon.value], "time": "09:00"},
        },
        {
            "is_schedule_enabled": False,
            "schedule": {"days": [DaysOfTheWeek.Mon.value], "time": "09:00"},
        },
        {"is_schedule_enabled": False},
    ],
)
def test_create_run_configuration(client, optional_params):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_plan_title = "Example test plan"
    run_configuration_title = "Example test plan"
    custom_data_ids = ["6086d152b28b871d6bdb604f"]

    available_in_response = {
        "title": run_configuration_title,
        "workspace_id": workspace_id,
        "run_plan_id": run_plan_id,
        "agent_ids": agent_ids,
        "custom_data_ids": custom_data_ids,
        **optional_params,
    }

    Workspace(id=workspace_id, name="Workpace 1").save()
    RunPlan(id=run_plan_id, title=run_plan_title).save()
    for agent_id in agent_ids:
        Agent(id=agent_id, hostname="host_%s" % agent_id, ip="test_ip").save()
    for custom_data_id in custom_data_ids:
        CustomData(id=custom_data_id, name="test.csv").save()

    request_data = {
        "title": run_configuration_title,
        "run_plan_id": run_plan_id,
        "workspace_id": workspace_id,
        "agent_ids": agent_ids,
        "custom_data_ids": custom_data_ids,
        **optional_params,
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


@pytest.mark.parametrize(
    "optional_params",
    [
        {},
        {"hosts": [{"host": "test", "ip": "127.0.0.3"}]},
        {"custom_properties": [{"name": "testProperty", "value": "123"}]},
        {"load_profile": [{"start": 1, "end": 10, "duration": 5}]},
        {"labels": ["label1", "label2"]},
        {
            "is_schedule_enabled": True,
            "schedule": {"days": [DaysOfTheWeek.Mon.value], "time": "09:00"},
        },
        {
            "is_schedule_enabled": False,
            "schedule": {"days": [DaysOfTheWeek.Mon.value], "time": "09:00"},
        },
        {"is_schedule_enabled": False},
    ],
)
def test_update_run_configuration(client, optional_params):
    run_configuration_id = "6106d1e3a216ff15b6e95e9d"
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_plan_title = "Example test plan"
    run_configuration_title = "Example test plan"

    available_in_response = {
        "title": run_configuration_title,
        "workspace_id": workspace_id,
        "run_plan_id": run_plan_id,
        "agent_ids": agent_ids,
        **optional_params,
    }
    Workspace(id=workspace_id, name="Workpace 1").save()
    RunPlan(id=run_plan_id, title=run_plan_title).save()
    for agent_id in agent_ids:
        Agent(id=agent_id, hostname="host_%s" % agent_id, ip="test_ip").save()

    RunConfiguration(
        id=run_configuration_id,
        workspace_id=workspace_id,
        title=run_configuration_title,
        agent_ids=agent_ids,
        run_plan_id=run_plan_id,
        hosts=[],
        custom_data_ids=[],
        custom_properties=[],
        load_profile=[],
        labels=["label1"],
    ).save()

    request_data = {
        "title": run_configuration_title,
        "workspace_id": workspace_id,
        "run_plan_id": run_plan_id,
        "agent_ids": agent_ids,
        **optional_params,
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
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_configuration_id = "6106d1e3a216ff15b6e95e9d"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_configuration_title = "Example test plan"

    RunConfiguration(
        id=run_configuration_id,
        workspace_id=workspace_id,
        title=run_configuration_title,
        agent_ids=agent_ids,
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
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    run_configuration_title = "Example test plan"
    hosts = [{"host": "test", "ip": "127.0.0.3"}]
    custom_properties = [{"name": "testProperty", "value": "123"}]
    load_profile = [{"start": 1, "end": 10, "duration": 5}]

    RunConfiguration(
        id=run_configuration_id,
        workspace_id=workspace_id,
        title=run_configuration_title,
        agent_ids=agent_ids,
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
    assert res_json["workspace_id"] == workspace_id
    assert res_json["title"] == run_configuration_title
    assert res_json["run_plan_id"] == run_plan_id
    assert res_json["agent_ids"] == agent_ids
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


@pytest.mark.parametrize(
    "db_data",
    [
        [
            dict(
                run_configuration_id="6076d69ba216ff15b6e95ea1",
                workspace_id="6076d1e3a216ff15b6e95e9a",
            ),
            dict(
                run_configuration_id="6076d69ba216ff15b6e95ea2",
                workspace_id="6076d1e3a216ff15b6e95e8a",
            ),
        ]
    ],
)
@pytest.mark.parametrize(
    "input_params,extected_ids",
    [
        (
            "",
            [
                "6076d69ba216ff15b6e95ea1",
                "6076d69ba216ff15b6e95ea2",
            ],
        ),
        (
            "?workspace_id=6076d1e3a216ff15b6e95e8a",
            [
                "6076d69ba216ff15b6e95ea2",
            ],
        ),
    ],
)
def test_run_configuration_list(client, db_data, input_params, extected_ids):
    for document in db_data:
        run_configuration_id = document["run_configuration_id"]
        workspace_id = document["workspace_id"]
        run_plan_id = "6076d1e3a216ff15b6e95e9d"
        agent_ids = ["6076d1bfb28b871d6bdb6095"]
        run_configuration_title = "Example test plan"
        hosts = [{"host": "test", "ip": "127.0.0.3"}]
        custom_properties = [{"name": "testProperty", "value": "123"}]
        Workspace(id=workspace_id, name="Workspace").save()
        RunConfiguration(
            id=run_configuration_id,
            workspace_id=workspace_id,
            title=run_configuration_title,
            agent_ids=agent_ids,
            run_plan_id=run_plan_id,
            hosts=hosts,
            custom_data_ids=[],
            custom_properties=custom_properties,
        ).save()

    response = client.get("/run_configurations%s" % input_params)

    res_json = json.loads(response.data)

    assert [e["id"] for e in res_json] == extected_ids
