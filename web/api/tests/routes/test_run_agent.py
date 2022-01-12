import json
import pytest
from maestro_api.db.models.run_agent import RunAgent, RunAgentStatus


@pytest.mark.parametrize(
    "db_data",
    [
        [
            dict(
                id="6076d69ba216ff15b6e95ea2",
                run_id="6076d1bfb28b871d6bdb6095",
                agent_id="6076d1c5b28b871d6bdb6091",
                agent_hostname="server1.maestro.net",
                agent_status=RunAgentStatus.RUNNING.value,
            ),
            dict(
                id="6076d69ba216ff15b6e95ea3",
                run_id="6076d1bfb28b871d6bdb6095",
                agent_id="6076d152b28b871d6bdb6042",
                agent_hostname="server2.maestro.net",
                agent_status=RunAgentStatus.RUNNING.value,
            ),
            dict(
                id="6076d69ba216ff15b6e95ea4",
                run_id="6076d1bfb28b871d6bdb6095",
                agent_id="6076d1cbb28b871d6bdb60a3",
                agent_hostname="server3.maestro.net",
                agent_status=RunAgentStatus.ERROR.value,
            ),
            dict(
                id="6076d69ba216ff15b6e95ea5",
                run_id="6076d1bfb28b871d6bdb6095",
                agent_id="6076d1cbb28b871d6bdb60a4",
                agent_hostname="server4.maestro.net",
                agent_status=RunAgentStatus.ERROR.value,
            ),
            dict(
                id="6076d69ba216ff15b6e95ea6",
                run_id="6076d1e3a216ff15b6e95e9d",
                agent_id="6076d1cbb28b871d6bdb60a5",
                agent_hostname="server5.maestro.net",
                agent_status=RunAgentStatus.FINISHED.value,
            ),
            dict(
                id="6076d69ba216ff15b6e95ea7",
                run_id="6076d1e3a216ff15b6e95e9d",
                agent_id="6076d1cbb28b871d6bdb60a6",
                agent_hostname="server6.maestro.net",
                agent_status=RunAgentStatus.PROCESSING.value,
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
                "6076d69ba216ff15b6e95ea2",
                "6076d69ba216ff15b6e95ea3",
                "6076d69ba216ff15b6e95ea4",
                "6076d69ba216ff15b6e95ea5",
                "6076d69ba216ff15b6e95ea6",
                "6076d69ba216ff15b6e95ea7",
            ],
        ),
        (
            "?agent_status=%s" % RunAgentStatus.PROCESSING.value,
            [
                "6076d69ba216ff15b6e95ea7",
            ],
        ),
        (
            "?agent_status=%s" % RunAgentStatus.FINISHED.value,
            [
                "6076d69ba216ff15b6e95ea6",
            ],
        ),
        (
            "?agent_status=%s" % RunAgentStatus.RUNNING.value,
            [
                "6076d69ba216ff15b6e95ea2",
                "6076d69ba216ff15b6e95ea3",
            ],
        ),
        (
            "?agent_status=%s&agent_id=6076d1cbb28b871d6bdb60a3"
            % RunAgentStatus.ERROR.value,
            [
                "6076d69ba216ff15b6e95ea4",
            ],
        ),
        (
            "?run_id=6076d1e3a216ff15b6e95e9d",
            [
                "6076d69ba216ff15b6e95ea6",
                "6076d69ba216ff15b6e95ea7",
            ],
        ),
    ],
)
def test_run_agent_list(client, db_data, input_params, extected_ids):
    for document in db_data:
        RunAgent(**document).save()

    response = client.get("/run_agents%s" % input_params)

    res_json = json.loads(response.data)

    assert [e["id"] for e in res_json] == extected_ids


def test_run_agent_list_bad_response(client):

    response = client.get("/run_agents?undefined=1")

    response_text = response.data.decode("utf-8")

    assert response.status_code == 400
    assert (
        response_text
        == "Additional properties are not allowed ('undefined' was unexpected)"
    )


@pytest.mark.parametrize(
    "agent_status,error_message",
    [
        (RunAgentStatus.RUNNING.value, ""),
        (RunAgentStatus.FINISHED.value, ""),
        (RunAgentStatus.ERROR.value, "Some error message"),
    ],
)
def test_run_agent_update(client, agent_status, error_message):
    run_agent_id = "6076d69ba216ff15b6e95ea2"
    run_id = "6076d69ba216ff15b6e95ea2"
    agent_id = "6076d1c5b28b871d6bdb609c"

    RunAgent(
        id=run_agent_id,
        run_id=run_id,
        agent_id=agent_id,
        agent_hostname="server1.maestro.net",
    ).save()

    request_data = {
        "agent_status": agent_status,
        "error_message": error_message,
        "agent_id": agent_id,
        "run_id": run_id,
    }
    response = client.put(
        "/run_agent",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    updated_agent = RunAgent.objects(run_id=run_id, agent_id=agent_id)

    res_json = json.loads(response.data)

    assert error_message == updated_agent[0].error_message
    assert agent_status == updated_agent[0].agent_status
    assert agent_status == res_json["agent_status"]
    assert error_message == res_json["error_message"]
