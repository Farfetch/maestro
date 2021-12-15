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


def test_list_agents(client):
    "404 error code should be thrown once document is not found"
    hostname = "localhost"
    ip = "127.0.1"

    agent = Agent(
        agent_status=AgentStatus.CREATING.value, hostname=hostname, ip=ip
    ).save()

    response = client.get("/agents")

    res_json = json.loads(response.data)
    expected_agent = {
        "id": str(agent.id),
        "hostname": hostname,
        "ip": ip,
        "agent_status": AgentStatus.CREATING.value,
    }

    assert len(res_json) == 1
    assert expected_agent.items() <= res_json[0].items()
