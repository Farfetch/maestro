import json
import pytest
from datetime import datetime
from maestro_api.db.models.agent_log import AgentLog

default_agents_data = [
    dict(
        agent_id="6076d69ba216ff15b6e95ea2",
        log_message="",
        level="DEBUG",
        created_at=datetime(2019, 1, 1),
    ),
    dict(
        agent_id="6076d69ba216ff15b6e95ea3",
        log_message="",
        created_at=datetime(2019, 2, 1),
    ),
    dict(
        agent_id="6076d69ba216ff15b6e95ea4",
        log_message="",
        created_at=datetime(2019, 3, 1),
    ),
    dict(
        agent_id="6076d69ba216ff15b6e95ea5",
        log_message="",
        created_at=datetime(2019, 4, 1),
    ),
    dict(
        agent_id="6076d69ba216ff15b6e95ea6",
        log_message="",
        created_at=datetime(2019, 5, 1),
    ),
    dict(
        agent_id="6076d69ba216ff15b6e95ea7",
        log_message="",
        created_at=datetime(2019, 6, 1),
    ),
    dict(
        agent_id="6076d69ba216ff15b6e95ea8",
        log_message="",
        level="ERROR",
        created_at=datetime(2019, 6, 1),
    ),
]


@pytest.mark.parametrize(
    "db_data",
    [default_agents_data],
)
@pytest.mark.parametrize(
    "input_params,extected_ids",
    [
        (
            "?date_from=2018-01-01 00:00:00&%s&%s"
            % (
                "agent_ids=6076d69ba216ff15b6e95ea7",
                "agent_ids=6076d69ba216ff15b6e95ea6",
            ),
            [
                "6076d69ba216ff15b6e95ea7",
                "6076d69ba216ff15b6e95ea6",
            ],
        ),
        (
            "?date_from=2019-06-01 00:00:00",
            [
                "6076d69ba216ff15b6e95ea7",
                "6076d69ba216ff15b6e95ea8",
            ],
        ),
        (
            "?date_from=2019-08-01 00:00:00&%s&%s"
            % (
                "agent_ids=6076d69ba216ff15b6e95ea7",
                "agent_ids=6076d69ba216ff15b6e95ea6",
            ),
            [],
        ),
        (
            "?date_from=2018-01-01 00:00:00&%s&%s"
            % (
                "agent_ids=8076d69ba216ff15b6e95ea7",
                "agent_ids=8076d69ba216ff15b6e95ea6",
            ),
            [],
        ),
        (
            "?date_from=2019-01-01 00:00:00&log_levels=ERROR",
            ["6076d69ba216ff15b6e95ea8"],
        ),
        (
            "?date_from=2019-01-01 00:00:00&log_levels=ERROR&log_levels=DEBUG",
            [
                "6076d69ba216ff15b6e95ea8",
                "6076d69ba216ff15b6e95ea2",
            ],
        ),
    ],
)
def test_agent_log_list(client, db_data, input_params, extected_ids):
    for document in db_data:
        AgentLog(**document).save()

    response = client.get("/agent_logs%s" % input_params)

    res_json = json.loads(response.data)

    assert [e["agent_id"] for e in res_json] == extected_ids


def test_create_agent_log_message(client):
    request_data = dict(
        agent_id="6076d69ba216ff15b6e95ea7",
        log_message="test agent log message",
        level="INFO",
    )
    response = client.post(
        "/agent_log",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    res_json = json.loads(response.data)

    assert request_data.items() <= res_json.items()


@pytest.mark.parametrize(
    "request_data,expected_error_message",
    [
        (
            dict(
                agent_id="test_id_1",
                log_message="test log message",
            ),
            "'level' is a required property",
        ),
        (
            dict(
                agent_id="test_id_1",
                log_message="test log message",
                level="INFO",
                undefined="test",
            ),
            "Additional properties are not allowed ('undefined' was unexpected)",
        ),
        (
            dict(
                log_message="test log message",
            ),
            "'agent_id' is a required property",
        ),
        (
            dict(
                agent_id="test_id_1",
            ),
            "'log_message' is a required property",
        ),
    ],
)
def test_create_agent_log_bad_response(client, request_data, expected_error_message):

    response = client.post(
        "/agent_log",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    response_text = response.data.decode("utf-8")

    assert response.status_code == 400
    assert response_text == expected_error_message
