import dateutil.parser

from maestro_agent.services.maestro_api.run import (
    Run,
    RunApi,
    RunStatus,
)


def test_maestro_run_get(mocker):
    run_id = "1-2-3-4"

    get_mock = mocker.patch(
        "maestro_agent.services.maestro_api.MaestroApiClient.get",
    )

    RunApi.get(run_id)

    get_mock.assert_called_with(
        "/api/run/1-2-3-4",
        mapper=RunApi.run_json_to_object,
    )
    get_mock.assert_called_once()


def test_maestro_run_mapped_response():

    run_id = "tr_id_1"
    run_plan_id = "tp_id_1"
    client_agent_id = "md_id_1"
    server_agent_ids = ["sd_id_1"]
    custom_data_ids = ["cd_id_1"]
    start = 1
    end = 10
    duration = 10
    host = "test.ff.net"
    ip = "127.0.0.2"
    custom_property = "custom_prop_test"
    custom_property_value = "123"

    created_at = "2021-05-19T17:31:47.560000"
    updated_at = "2021-06-19T17:31:47.560000"

    expected = Run(
        id=run_id,
        run_status=RunStatus.PENDING.value,
        run_plan_id=run_plan_id,
        client_agent_id=client_agent_id,
        server_agent_ids=server_agent_ids,
        custom_data_ids=custom_data_ids,
        hosts=[dict(host=host, ip=ip)],
        custom_properties=[dict(name=custom_property, value=custom_property_value)],
        load_profile=[dict(start=start, end=end, duration=duration)],
        created_at=dateutil.parser.parse(created_at),
        updated_at=dateutil.parser.parse(updated_at),
    )

    actual = RunApi.run_json_to_object(
        dict(
            id=run_id,
            run_status=RunStatus.PENDING.value,
            run_plan_id=run_plan_id,
            client_agent_id=client_agent_id,
            server_agent_ids=server_agent_ids,
            custom_data_ids=custom_data_ids,
            hosts=[dict(host=host, ip=ip)],
            custom_properties=[dict(name=custom_property, value=custom_property_value)],
            load_profile=[dict(start=start, end=end, duration=duration)],
            created_at=created_at,
            updated_at=updated_at,
        )
    )
    assert expected.id == actual.id
    assert expected.run_status == actual.run_status
    assert expected.run_plan_id == actual.run_plan_id
    assert expected.client_agent_id == actual.client_agent_id
    assert expected.server_agent_ids == actual.server_agent_ids
    assert expected.custom_data_ids == actual.custom_data_ids
    assert expected.hosts[0].host == actual.hosts[0].host
    assert expected.hosts[0].ip == actual.hosts[0].ip
    assert expected.load_profile[0].start == actual.load_profile[0].start
    assert expected.load_profile[0].end == actual.load_profile[0].end
    assert expected.load_profile[0].duration == actual.load_profile[0].duration
    assert expected.created_at == actual.created_at
    assert expected.updated_at == actual.updated_at


def test_maestro_run_update(mocker):
    run_id = "1-2-3-4"
    run_status = "RUNNING"
    data = {"run_status": run_status}

    put_mock = mocker.patch(
        "maestro_agent.services.maestro_api.MaestroApiClient.put",
    )

    RunApi.update(run_id, run_status)

    put_mock.assert_called_with(
        "/api/run/1-2-3-4",
        data=data,
        mapper=RunApi.run_json_to_object,
    )
    put_mock.assert_called_once()


def test_maestro_run_finish(mocker):
    run_id = "1-2-3-4"

    post_mock = mocker.patch(
        "maestro_agent.services.maestro_api.MaestroApiClient.post",
    )

    RunApi.finish(run_id)

    post_mock.assert_called_with("/api/run_status/1-2-3-4/finish")
    post_mock.assert_called_once()


def test_maestro_run_send_metrics(mocker):
    run_id = "1-2-3-4"
    metrics = {"test": 1}

    post_mock = mocker.patch(
        "maestro_agent.services.maestro_api.MaestroApiClient.post",
    )

    RunApi.send_metrics(run_id, metrics)

    post_mock.assert_called_with(
        "/api/run_metrics/1-2-3-4",
        data={"metrics": metrics},
    )
    post_mock.assert_called_once()
