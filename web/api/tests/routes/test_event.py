import json
import pytest
from maestro_api.db.models.event import Event, EventType, EventStatus


@pytest.mark.parametrize(
    "db_data",
    [
        [
            dict(
                id="6076d69ba216ff15b6e95ea2",
                event_type=EventType.START_RUN.value,
                run_id="6076d1bfb28b871d6bdb6095",
                agent_id="6076d1c5b28b871d6bdb609c",
            ),
            dict(
                id="6076d69ba216ff15b6e95ea4",
                event_type=EventType.STOP_RUN.value,
                run_id="6076d1bfb28b871d6bdb6095",
                agent_id="6076d1cbb28b871d6bdb60a1",
            ),
            dict(
                id="6076d69ba216ff15b6e95ea6",
                event_type=EventType.START_RUN.value,
                event_status=EventStatus.FINISHED.value,
                run_id="6076d1e3a216ff15b6e95e9d",
                agent_id="6076d1cbb28b871d6bdb60a1",
            ),
            dict(
                id="6076d69ba216ff15b6e95ea7",
                event_type=EventType.START_RUN.value,
                event_status=EventStatus.PROCESSING.value,
                run_id="6076d1e3a216ff15b6e95e9d",
                agent_id="6076d1cbb28b871d6bdb60a1",
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
            "?event_status=%s" % EventStatus.PROCESSING.value,
            [
                "6076d69ba216ff15b6e95ea7",
            ],
        ),
        (
            "?event_status=%s" % EventStatus.FINISHED.value,
            [
                "6076d69ba216ff15b6e95ea6",
            ],
        ),
        (
            "?event_type=%s" % EventType.START_RUN.value,
            [
                "6076d69ba216ff15b6e95ea2",
                "6076d69ba216ff15b6e95ea6",
                "6076d69ba216ff15b6e95ea7",
            ],
        ),
        (
            "?event_type=%s&agent_id=6076d1c5b28b871d6bdb609c"
            % EventType.START_RUN.value,
            [
                "6076d69ba216ff15b6e95ea2",
            ],
        ),
    ],
)
def test_events_list(client, db_data, input_params, extected_ids):
    for document in db_data:
        Event(**document).save()

    response = client.get("/events%s" % input_params)

    res_json = json.loads(response.data)

    assert [e["id"] for e in res_json] == extected_ids


def test_events_list_bad_response(client):

    response = client.get("/events?undefined=1")

    response_text = response.data.decode("utf-8")

    assert response.status_code == 400
    assert (
        response_text
        == "Additional properties are not allowed ('undefined' was unexpected)"
    )


@pytest.mark.parametrize(
    "event_status",
    [EventStatus.PROCESSING.value, EventStatus.FINISHED.value],
)
def test_update_event_status(client, event_status):
    event_id = "6076d69ba216ff15b6e95ea2"

    Event(
        id=event_id,
        event_type=EventType.START_RUN.value,
        run_id="6076d1bfb28b871d6bdb6095",
        agent_id="6076d1c5b28b871d6bdb609c",
    ).save()

    request_data = {"event_status": event_status}
    response = client.put(
        "/event/%s" % event_id,
        data=json.dumps(request_data),
        content_type="application/json",
    )

    res_json = json.loads(response.data)

    if event_status:
        assert res_json["event_status"] == event_status

    if event_status == EventStatus.PROCESSING:
        assert "started_at" in res_json

    if event_status == EventStatus.FINISHED:
        assert "finished_at" in res_json
