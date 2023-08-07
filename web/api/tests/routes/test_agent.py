import json
import pytest
from maestro_api.db.models.agent import Agent, AgentStatus


def test_agent_route_created_status(client):
    hostname = "localhost"
    ip = "127.0.1"
    data = dict(hostname=hostname, ip=ip)

    response = client.put(
        "/agent", data=json.dumps(data), content_type="application/json"
    )

    res_json = json.loads(response.data)

    assert res_json["agent_status"] == AgentStatus.CREATING.value


def test_agent_route_db_insert(client):
    hostname = "localhost"
    ip = "127.0.1"
    data = dict(hostname=hostname, ip=ip)

    client.put("/agent", data=json.dumps(data), content_type="application/json")

    first_agent = Agent.objects().first()

    assert first_agent.agent_status == AgentStatus.CREATING.value


def test_agent_route_hostname_updated(client):
    hostname = "localhost"
    ip = "127.0.1"
    data = dict(hostname=hostname, ip=ip)
    Agent(
        agent_status=AgentStatus.CREATING.value, hostname=hostname, ip="old_ip"
    ).save()

    response = client.put(
        "/agent", data=json.dumps(data), content_type="application/json"
    )

    res_json = json.loads(response.data)

    assert res_json["ip"] == ip


def test_agent_route_hostname_updated_in_db(client):
    hostname = "localhost"
    ip = "127.0.1"
    data = dict(hostname=hostname, ip=ip)
    Agent(
        agent_status=AgentStatus.CREATING.value, hostname=hostname, ip="old_ip"
    ).save()

    client.put("/agent", data=json.dumps(data), content_type="application/json")

    updated_agent = Agent.objects(hostname=hostname).get()

    assert updated_agent.ip == ip


def test_agent_route_status_update_with_404(client):
    "404 error code should be thrown once document is not found"

    data = dict(agent_status=AgentStatus.AVAILABLE.value)
    agent_id = "605a6a343fad44361d884795"
    url = "/agent/%s" % agent_id

    response = client.put(url, data=json.dumps(data), content_type="application/json")

    assert response.status_code == 404


def test_agent_route_status_update_success(client):
    "agent status should be updated once document is found and incomming data is valid"
    agent = Agent(hostname="123", ip="127.0.0.1").save()

    data = dict(agent_status=AgentStatus.AVAILABLE.value)
    url = "/agent/%s" % agent.id

    response = client.put(url, data=json.dumps(data), content_type="application/json")

    res_json = json.loads(response.data)

    assert res_json["agent_status"] == AgentStatus.AVAILABLE.value


def test_agent_route_status_update_disabled_status(client):
    "agent status should be updated once document is found and incomming data is valid"
    agent = Agent(hostname="123", ip="127.0.0.1").save()

    data = dict(agent_status=AgentStatus.DISABLED.value)
    url = "/agent/%s" % agent.id

    response = client.put(url, data=json.dumps(data), content_type="application/json")

    res_json = json.loads(response.data)

    assert res_json["agent_status"] == AgentStatus.DISABLED.value


@pytest.mark.parametrize(
    "test_input",
    [
        (dict(agent_status=1)),
        (dict(agent_status=None)),
        (dict(agent_status="")),
        (dict(agent_status="some_value")),
    ],
)
def test_agent_route_status_update_bad_response(client, test_input):
    "Bad request error should be thrown once incoming data is not valid"
    agent = Agent(hostname="123", ip="127.0.0.1").save()

    url = "/agent/%s" % agent.id

    response = client.put(
        url, data=json.dumps(test_input), content_type="application/json"
    )

    assert response.status_code == 400


def test_get_agent_route(client):
    "Should return agent object"
    hostname = "localhost"
    ip = "127.0.1"

    agent = Agent(
        agent_status=AgentStatus.CREATING.value, hostname=hostname, ip=ip
    ).save()

    expected_res = {
        "id": str(agent.id),
        "hostname": hostname,
        "ip": ip,
        "agent_status": AgentStatus.CREATING.value,
    }

    response = client.get(
        "/agent/%s" % agent.id,
    )

    res_json = json.loads(response.data)

    assert expected_res.items() <= res_json.items()
    assert "created_at" in res_json
    assert "updated_at" in res_json


def test_get_agent_route_with_404(client):
    "404 error code should be thrown once document is not found"
    agent_id = "605a6a343fad44361d884795"

    response = client.get("/agent/%s" % agent_id)

    assert response.status_code == 404


agent_db_data = [
    dict(
        agent_ip="127.0.1",
        agent_hostname="server1.maestro.net",
        agent_status=AgentStatus.DISABLED.value,
    ),
    dict(
        agent_ip="127.0.2",
        agent_hostname="server2.maestro.net",
        agent_status=AgentStatus.UNAVAILABLE.value,
    ),
    dict(
        agent_ip="127.0.3",
        agent_hostname="server3.maestro.net",
        agent_status=AgentStatus.CREATING.value,
    ),
    dict(
        agent_ip="127.0.4",
        agent_hostname="server4.maestro.net",
        agent_status=AgentStatus.AVAILABLE.value,
    ),
    dict(
        agent_ip="127.0.5",
        agent_hostname="server5.maestro.net",
        agent_status=AgentStatus.DISABLED.value,
    ),
    dict(
        agent_ip="127.0.6",
        agent_hostname="server6.maestro.net",
        agent_status=AgentStatus.RUNNING_TEST.value,
    ),
    dict(
        agent_ip="127.0.7",
        agent_hostname="server7.maestro.net",
        agent_status=AgentStatus.PROCESSING_EVENT.value,
    ),
    dict(
        agent_ip="127.0.8",
        agent_hostname="server8.maestro.net",
        agent_status=AgentStatus.DISABLED.value,
    ),
]

@pytest.mark.parametrize(
    "db_data",
    [agent_db_data],
)
@pytest.mark.parametrize(
    "input_params,expected_ids",
    [
        (
            "",
            [
                "server1.maestro.net",
                "server2.maestro.net",
                "server3.maestro.net",
                "server4.maestro.net",
                "server5.maestro.net",
                "server6.maestro.net",
                "server7.maestro.net",
                "server8.maestro.net",
            ],
        ),
    ],
)
def test_list_agents(client, db_data, input_params, expected_ids):
    for document in db_data:
        Agent(
            agent_status=document["agent_status"],
            hostname=document["agent_hostname"],
            ip=document["agent_ip"],
        ).save()

    response = client.get("/agents%s" % input_params)

    res_json = json.loads(response.data)

    assert [e["hostname"] for e in res_json] == expected_ids


@pytest.mark.parametrize(
    "db_data",
    [agent_db_data],
)
@pytest.mark.parametrize(
    "input_params,expected_ids",
    [
        (
            "?agent_status=%s" % AgentStatus.DISABLED.value,
            [
                "server2.maestro.net",
                "server3.maestro.net",
                "server4.maestro.net",
                "server6.maestro.net",
                "server7.maestro.net",
            ],
        ),
    ],
)
def test_list_agents_except_disabled(client, db_data, input_params, expected_ids):
    for document in db_data:
        Agent(
            agent_status=document["agent_status"],
            hostname=document["agent_hostname"],
            ip=document["agent_ip"],
        ).save()

    response = client.get("/agents%s" % input_params)

    res_json = json.loads(response.data)

    assert [e["hostname"] for e in res_json] == expected_ids
