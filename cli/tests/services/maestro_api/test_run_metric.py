import dateutil.parser

from maestro_cli.services.maestro_api.run_metric import RunMetric, RunMetricApi


def test_maestro_api_metrics_all(mocker):
    run_id = "1-2-3-4"

    get_mock = mocker.patch(
        "maestro_cli.services.maestro_api.MaestroApiClient.get",
    )

    RunMetricApi.all(run_id)

    get_mock.assert_called_with(
        "/api/run_metrics/%s" % run_id,
        data={"time_interval": 15},
        mapper=RunMetricApi.run_metric_json_to_object,
    )
    get_mock.assert_called_once()


def test_maestro_api_metrics_mapped_response():

    latency_avg = 10.1
    latency_p99 = 20.1
    latency_p95 = 30.1
    latency_p90 = 40.1
    latency_p50 = 50.1
    latency_avg = 25.6
    success_count = 100
    total_count = 110

    min_datetime = "2021-05-19T17:31:47.560000"
    max_datetime = "2021-06-19T17:31:47.560000"

    expected = RunMetric(
        latency_avg=latency_avg,
        latency_p99=latency_p99,
        latency_p95=latency_p95,
        latency_p90=latency_p90,
        latency_p50=latency_p50,
        success_count=success_count,
        total_count=total_count,
        min_datetime=dateutil.parser.parse(min_datetime),
        max_datetime=dateutil.parser.parse(max_datetime),
    )

    actual = RunMetricApi.run_metric_json_to_object(
        dict(
            latency_avg=latency_avg,
            latency_p99=latency_p99,
            latency_p95=latency_p95,
            latency_p90=latency_p90,
            latency_p50=latency_p50,
            success_count=success_count,
            total_count=total_count,
            min_datetime=min_datetime,
            max_datetime=max_datetime,
        )
    )

    assert expected.latency_avg == actual.latency_avg
    assert expected.latency_p99 == actual.latency_p99
    assert expected.latency_p95 == actual.latency_p95
    assert expected.latency_p90 == actual.latency_p90
    assert expected.latency_p50 == actual.latency_p50
    assert expected.success_count == actual.success_count
    assert expected.total_count == actual.total_count
    assert expected.min_datetime == actual.min_datetime
    assert expected.max_datetime == actual.max_datetime
