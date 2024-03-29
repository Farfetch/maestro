import json
import pytest
from freezegun import freeze_time
from datetime import datetime

from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.models.run import Run, RunStatus
from maestro_api.db.models.run_agent import RunAgent, RunAgentStatus


def test_create_run(client):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    agent_hostname = "agent1.net"
    agent_ip = "127.0.0.5"
    title = "Example test plan"
    labels = ["label1", "label2"]

    available_in_response = {
        "run_status": RunStatus.PENDING.value,
        "title": title,
        "run_configuration_id": run_configuration_id,
        "run_plan_id": run_plan_id,
        "workspace_id": workspace_id,
        "agent_ids": agent_ids,
        "labels": labels,
    }

    RunConfiguration(
        id=run_configuration_id,
        workspace_id=workspace_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        labels=labels,
    ).save()

    Agent(id=agent_ids[0], ip=agent_ip, hostname=agent_hostname).save()

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


def test_create_run_with_title_tokens(client):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    agent_hostname = "agent1.net"
    agent_ip = "127.0.0.5"
    title = "Example test agents: {NUM_AGENTS} and custom property: {testProperty}"
    labels = ["label1", "label2"]
    custom_properties = [{"name": "testProperty", "value": "123"}]

    RunConfiguration(
        id=run_configuration_id,
        workspace_id=workspace_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        labels=labels,
        custom_properties=custom_properties,
    ).save()

    Agent(id=agent_ids[0], ip=agent_ip, hostname=agent_hostname).save()

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
    assert res_json["title"] == "Example test agents: 1 and custom property: 123"


def test_create_run_with_agent_runs(client):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"

    agents = [
        {"id": "6076d1bfb28b871d6bdb6095", "hostname": "agent1.net", "ip": "127.0.0.5"},
        {"id": "6076d1bfb28b871d6bdb6096", "hostname": "agent2.net", "ip": "127.0.0.6"},
    ]
    title = "Example test plan"

    RunConfiguration(
        id=run_configuration_id,
        workspace_id=workspace_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=[agent["id"] for agent in agents],
    ).save()

    for agent in agents:
        Agent(id=agent["id"], ip=agent["ip"], hostname=agent["hostname"]).save()

    request_data = {
        "run_configuration_id": run_configuration_id,
    }

    response = client.post(
        "/run",
        data=json.dumps(request_data),
        content_type="application/json",
    )
    res_json = json.loads(response.data)
    agent_runs = RunAgent.objects()

    assert response.status_code == 200
    assert 2 == len(agent_runs)

    assert agents[0]["id"] == str(agent_runs[0].agent_id)
    assert agents[0]["hostname"] == str(agent_runs[0].agent_hostname)
    assert res_json["id"] == str(agent_runs[0].run_id)
    assert RunAgentStatus.PROCESSING.value == str(agent_runs[0].agent_status)

    assert agents[1]["id"] == str(agent_runs[1].agent_id)
    assert agents[1]["hostname"] == str(agent_runs[1].agent_hostname)
    assert res_json["id"] == str(agent_runs[1].run_id)
    assert RunAgentStatus.PROCESSING.value == str(agent_runs[1].agent_status)


def test_create_run_with_hosts(client):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    agent_hostname = "agent1.net"
    agent_ip = "127.0.0.5"
    hosts = [{"host": "test", "ip": "127.0.0.3"}]
    title = "Example test plan"
    load_profile = [{"start": 1, "end": 10, "duration": 5}]
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"

    available_in_response = {
        "title": title,
        "workspace_id": workspace_id,
        "run_configuration_id": run_configuration_id,
        "run_status": RunStatus.PENDING.value,
        "run_plan_id": run_plan_id,
        "agent_ids": agent_ids,
        "hosts": hosts,
        "load_profile": load_profile,
    }

    RunConfiguration(
        id=run_configuration_id,
        workspace_id=workspace_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        load_profile=load_profile,
        hosts=hosts,
    ).save()

    Agent(id=agent_ids[0], ip=agent_ip, hostname=agent_hostname).save()

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
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]

    data_to_create = {
        "id": run_id,
        "run_configuration_id": run_configuration_id,
        "workspace_id": workspace_id,
        "title": title,
        "run_plan_id": run_plan_id,
        "agent_ids": agent_ids,
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


@freeze_time("2012-01-01 10:00:00")
@pytest.mark.parametrize(
    "run_status,started_at,finished_at",
    [
        (
            RunStatus.PENDING.value,
            "2012-01-01 10:00:00",
            "2012-01-01 10:00:00",
        ),
        (
            RunStatus.CREATING.value,
            "2012-01-01 10:00:00",
            "2012-01-01 10:00:00",
        ),
        (
            RunStatus.RUNNING.value,
            "2012-01-01 10:00:00",
            "2012-01-01 10:00:00",
        ),
        (
            RunStatus.ERROR.value,
            "2011-01-01 10:00:00",
            "2012-01-01 10:00:00",
        ),
        (
            RunStatus.FINISHED.value,
            "2011-01-01 10:00:00",
            "2012-01-01 10:00:00",
        ),
        (
            RunStatus.STOPPED.value,
            "2011-01-01 10:00:00",
            "2012-01-01 10:00:00",
        ),
    ],
)
def test_update_run_status(client, run_status, started_at, finished_at):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]

    Run(
        id=run_id,
        workspace_id=workspace_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        run_status=RunStatus.PENDING.value,
        started_at="2011-01-01 10:00:00",
        finished_at="2011-01-01 10:00:00",
    ).save()

    run_id = "6076d1e3a216ff15b6e95e1f"
    request_data = {"run_status": run_status}

    response = client.put(
        "/run/%s" % run_id,
        data=json.dumps(request_data),
        content_type="application/json",
    )

    updated_run = Run.objects.get(id=run_id)

    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert run_status == res_json["run_status"]
    assert run_status == updated_run.run_status
    assert started_at == res_json["started_at"]
    assert finished_at == res_json["finished_at"]


def test_update_run_notes(client):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    notes = "Notes after update..."

    Run(
        id=run_id,
        workspace_id=workspace_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        notes="Some default value",
    ).save()

    run_id = "6076d1e3a216ff15b6e95e1f"
    request_data = {"notes": notes}

    response = client.put(
        "/run/%s" % run_id,
        data=json.dumps(request_data),
        content_type="application/json",
    )

    updated_run = Run.objects.get(id=run_id)

    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert notes == res_json["notes"]
    assert RunStatus.PENDING.value == updated_run.run_status


def test_update_run_labels(client):
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    labels = ["label1", "label2"]

    Run(
        id=run_id,
        workspace_id=workspace_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        labels=["label3"],
    ).save()

    run_id = "6076d1e3a216ff15b6e95e1f"
    request_data = {"labels": labels}

    response = client.put(
        "/run/%s" % run_id,
        data=json.dumps(request_data),
        content_type="application/json",
    )

    updated_run = Run.objects.get(id=run_id)

    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert labels == res_json["labels"]
    assert RunStatus.PENDING.value == updated_run.run_status


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
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]

    run = Run(
        id=run_id,
        workspace_id=workspace_id,
        run_configuration_id=run_configuration_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        run_status=RunStatus.PENDING.value,
    ).save()

    response = client.get("/runs")

    res_json = json.loads(response.data)

    expected_run = {
        "id": str(run.id),
        "run_plan_id": run_plan_id,
        "agent_ids": agent_ids,
        "run_status": RunStatus.PENDING.value,
        "hosts": [],
    }

    assert len(res_json) == 1
    assert expected_run.items() <= res_json[0].items()


def test_create_run_with_custom_properties(client):
    "Returns single test run when test run with properties created"
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]
    agent_hostname = "agent1.net"
    agent_ip = "127.0.0.5"
    custom_properties = [{"name": "testProperty", "value": "123"}]

    available_in_response = {
        "run_status": RunStatus.PENDING.value,
        "run_plan_id": run_plan_id,
        "agent_ids": agent_ids,
        "custom_properties": custom_properties,
    }

    RunConfiguration(
        id=run_configuration_id,
        workspace_id=workspace_id,
        title=title,
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        custom_properties=custom_properties,
    ).save()
    Agent(id=agent_ids[0], ip=agent_ip, hostname=agent_hostname).save()

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
    workspace_id = "6076d1e3a216ff15b6e95e9a"
    run_configuration_id = "6326d1e3a216ff15b6e95e9d"
    title = "some example title"
    run_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1bfb28b871d6bdb6095"]

    data_to_create = {
        "id": run_id,
        "run_configuration_id": run_configuration_id,
        "workspace_id": workspace_id,
        "title": title,
        "run_plan_id": run_plan_id,
        "agent_ids": agent_ids,
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


default_runs_data = [
    dict(
        run_id="6076d69ba216ff15b6e95ea1",
        workspace_id="6076d1e3a216ff15b6e95e9a",
        labels=["label1", "label2"],
        run_status=RunStatus.PENDING.value,
        started_at=datetime(2019, 1, 1),
        title="title1",
    ),
    dict(
        run_id="6076d69ba216ff15b6e95ea2",
        workspace_id="6076d1e3a216ff15b6e95e9a",
        labels=["label1"],
        run_status=RunStatus.RUNNING.value,
        started_at=datetime(2019, 2, 1),
        title="title2",
    ),
    dict(
        run_id="6076d69ba216ff15b6e95ea3",
        workspace_id="6076d1e3a216ff15b6e95e9a",
        labels=[],
        run_status=RunStatus.RUNNING.value,
        started_at=datetime(2019, 3, 1),
        title="title12",
    ),
    dict(
        run_id="6076d69ba216ff15b6e95ea4",
        workspace_id="6076d1e3a216ff15b6e95e9a",
        labels=["label2"],
        run_status=RunStatus.RUNNING.value,
        started_at=datetime(2019, 4, 1),
        title="title21",
    ),
    dict(
        run_id="6076d69ba216ff15b6e95ea5",
        workspace_id="6076d1e3a216ff15b6e95e8a",
        labels=["label1", "label2"],
        run_status=RunStatus.FINISHED.value,
        started_at=datetime(2019, 5, 1),
        title="title11",
    ),
]


@pytest.mark.parametrize(
    "db_data",
    [default_runs_data],
)
@pytest.mark.parametrize(
    "input_params,extected_ids",
    [
        (
            "",
            [
                "6076d69ba216ff15b6e95ea5",
                "6076d69ba216ff15b6e95ea4",
                "6076d69ba216ff15b6e95ea3",
                "6076d69ba216ff15b6e95ea2",
                "6076d69ba216ff15b6e95ea1",
            ],
        ),
        (
            "?sort=started_at&skip=1&limit=1",
            [
                "6076d69ba216ff15b6e95ea2",
            ],
        ),
        (
            "?labels=label1&labels=label2",
            [
                "6076d69ba216ff15b6e95ea5",
                "6076d69ba216ff15b6e95ea1",
            ],
        ),
        (
            "?run_status=FINISHED",
            [
                "6076d69ba216ff15b6e95ea5",
            ],
        ),
        (
            "?run_status=RUNNING&labels=label2",
            [
                "6076d69ba216ff15b6e95ea4",
            ],
        ),
        (
            "?workspace_id=6076d1e3a216ff15b6e95e8a",
            [
                "6076d69ba216ff15b6e95ea5",
            ],
        ),
    ],
)
def test_run_list(client, db_data, input_params, extected_ids):
    for document in db_data:
        run_configuration_id = "6326d1e3a216ff15b6e95e9d"
        title = "some example title"
        run_plan_id = "6076d1e3a216ff15b6e95e9d"
        agent_ids = ["6076d1bfb28b871d6bdb6095"]

        Run(
            id=document["run_id"],
            workspace_id=document["workspace_id"],
            run_configuration_id=run_configuration_id,
            title=title,
            run_plan_id=run_plan_id,
            agent_ids=agent_ids,
            run_status=document["run_status"],
            labels=document["labels"],
            started_at=document["started_at"],
        ).save()

    response = client.get("/runs%s" % input_params)

    res_json = json.loads(response.data)

    assert [e["id"] for e in res_json] == extected_ids


@pytest.mark.parametrize(
    "db_data",
    [default_runs_data],
)
@pytest.mark.parametrize(
    "input_params,expected_ids",
    [
        (
            "?title=title1",
            [
                "6076d69ba216ff15b6e95ea5",
                "6076d69ba216ff15b6e95ea3",
                "6076d69ba216ff15b6e95ea1",
            ],
        ),
    ],
)
def test_run_search_run_title(client, db_data, input_params, expected_ids):
    "Return all runs that contain title1 in the Title"
    for document in db_data:
        run_configuration_id = "6326d1e3a216ff15b6e95e9d"
        run_plan_id = "6076d1e3a216ff15b6e95e9d"
        agent_ids = ["6076d1bfb28b871d6bdb6095"]

        Run(
            id=document["run_id"],
            workspace_id=document["workspace_id"],
            run_configuration_id=run_configuration_id,
            title=document["title"],
            run_plan_id=run_plan_id,
            agent_ids=agent_ids,
            run_status=document["run_status"],
            labels=document["labels"],
            started_at=document["started_at"],
        ).save()

    response = client.get("/runs%s" % input_params)

    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert len(res_json) == 3
    assert [e["id"] for e in res_json] == expected_ids


@pytest.mark.parametrize(
    "db_data",
    [default_runs_data],
)
@pytest.mark.parametrize(
    "input_params,expected_ids",
    [
        (
            "?title=TITLE1",
            [
                "6076d69ba216ff15b6e95ea5",
                "6076d69ba216ff15b6e95ea3",
                "6076d69ba216ff15b6e95ea1",
            ],
        ),
    ],
)
def test_run_search_run_title_case_insensitive(
    client, db_data, input_params, expected_ids
):
    "Return all runs that contain TITLE1 in the Title, checks case sensitiveness"
    for document in db_data:
        run_configuration_id = "6326d1e3a216ff15b6e95e9d"
        run_plan_id = "6076d1e3a216ff15b6e95e9d"
        agent_ids = ["6076d1bfb28b871d6bdb6095"]

        Run(
            id=document["run_id"],
            workspace_id=document["workspace_id"],
            run_configuration_id=run_configuration_id,
            title=document["title"],
            run_plan_id=run_plan_id,
            agent_ids=agent_ids,
            run_status=document["run_status"],
            labels=document["labels"],
            started_at=document["started_at"],
        ).save()

    response = client.get("/runs%s" % input_params)

    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert len(res_json) == 3
    assert [e["id"] for e in res_json] == expected_ids


@pytest.mark.parametrize(
    "db_data",
    [default_runs_data],
)
@pytest.mark.parametrize(
    "input_params,expected_ids",
    [
        (
            "?run_configuration_id=6326d1e3a216ff15b6e95e9d",
            [
                "6076d69ba216ff15b6e95ea5",
                "6076d69ba216ff15b6e95ea4",
                "6076d69ba216ff15b6e95ea3",
                "6076d69ba216ff15b6e95ea2",
                "6076d69ba216ff15b6e95ea1",
            ],
        ),
    ],
)
def test_run_search_run_by_configuration_id(
    client, db_data, input_params, expected_ids
):
    "Return all runs that contain the run_configuration_id"
    for document in db_data:
        run_configuration_id = "6326d1e3a216ff15b6e95e9d"
        run_plan_id = "6076d1e3a216ff15b6e95e9d"
        agent_ids = ["6076d1bfb28b871d6bdb6095"]

        Run(
            id=document["run_id"],
            workspace_id=document["workspace_id"],
            run_configuration_id=run_configuration_id,
            title=document["title"],
            run_plan_id=run_plan_id,
            agent_ids=agent_ids,
            run_status=document["run_status"],
            labels=document["labels"],
            started_at=document["started_at"],
        ).save()

    response = client.get("/runs%s" % input_params)

    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert len(res_json) == 5
    assert [e["id"] for e in res_json] == expected_ids
    assert [e["run_configuration_id"] == "6326d1e3a216ff15b6e95e9d" for e in res_json]


@pytest.mark.parametrize(
    "db_data",
    [default_runs_data],
)
@pytest.mark.parametrize(
    "input_params,expected_ids",
    [
        (
            "?title=6326d1e3a216ff15b6e95e9d",
            [
                "6076d69ba216ff15b6e95ea5",
                "6076d69ba216ff15b6e95ea4",
                "6076d69ba216ff15b6e95ea3",
                "6076d69ba216ff15b6e95ea2",
                "6076d69ba216ff15b6e95ea1",
            ],
        ),
    ],
)
def test_run_search_by_title_or_run_configuration_id(
    client, db_data, input_params, expected_ids
):
    "Return all runs that contain the search term in title or run_configuration_id"
    for document in db_data:
        run_configuration_id = "6326d1e3a216ff15b6e95e9d"
        run_plan_id = "6076d1e3a216ff15b6e95e9d"
        agent_ids = ["6076d1bfb28b871d6bdb6095"]

        Run(
            id=document["run_id"],
            workspace_id=document["workspace_id"],
            run_configuration_id=run_configuration_id,
            title=document["title"],
            run_plan_id=run_plan_id,
            agent_ids=agent_ids,
            run_status=document["run_status"],
            labels=document["labels"],
            started_at=document["started_at"],
        ).save()

    response = client.get("/runs%s" % input_params)

    res_json = json.loads(response.data)

    assert response.status_code == 200
    assert len(res_json) == 5
    assert [e["id"] for e in res_json] == expected_ids
    assert [e["run_configuration_id"] == "6326d1e3a216ff15b6e95e9d" for e in res_json]
