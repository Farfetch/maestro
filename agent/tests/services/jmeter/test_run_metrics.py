from maestro_agent.services.jmeter.run_metrics import RunMetricsProcessor
import datetime

from unittest.mock import call


def test_log_metrics_send_errors_metrics_should_be_sent(mocker):
    logger_error = mocker.patch("maestro_agent.logging.Logger.error")
    run = "1-2-3"
    test_processor = RunMetricsProcessor(run, start_processing_workers=False)

    last_time_sent = datetime.datetime.now() - datetime.timedelta(seconds=10)
    test_processor.send_metrics_error["last_time_sent"] = last_time_sent
    test_processor.send_metrics_error["count"] = 1

    test_processor.log_metrics_send_errors()
    logger_error.assert_called_once()


def test_log_metrics_send_errors_metrics_should_not_be_sent(mocker):
    logger_error = mocker.patch("maestro_agent.logging.Logger.error")
    run = "1-2-3"
    test_processor = RunMetricsProcessor(run, start_processing_workers=False)
    last_time_sent = datetime.datetime.now() - datetime.timedelta(seconds=1)
    test_processor.send_metrics_error["last_time_sent"] = last_time_sent
    test_processor.send_metrics_error["count"] = 1

    test_processor.log_metrics_send_errors()
    logger_error.assert_not_called()


def test_log_metrics_send_errors_metrics_with_metrics_count_0(mocker):
    logger_error = mocker.patch("maestro_agent.logging.Logger.error")
    run = "1-2-3"
    test_processor = RunMetricsProcessor(run, start_processing_workers=False)

    last_time_sent = datetime.datetime.now() - datetime.timedelta(seconds=10)
    test_processor.send_metrics_error["last_time_sent"] = last_time_sent
    test_processor.send_metrics_error["count"] = 0

    test_processor.log_metrics_send_errors()
    logger_error.assert_not_called()


def test_split_by_last_seconds_default_values():
    """
    Metrics can be not sorted and should be return in proper order without splitting
    """
    run = "1-2-3"

    metrics = [
        {
            "timeStamp": 1633708360200,  # Friday, 8 October 2021 15:52:40.200
        },
        {
            "timeStamp": 1633708363609,  # Friday, 8 October 2021 15:52:43.609
        },
        {
            "timeStamp": 1633708362600,  # Friday, 8 October 2021 15:52:42.600
        },
        {
            "timeStamp": 1633708363999,  # Friday, 8 October 2021 15:52:43.999
        },
    ]
    test_processor = RunMetricsProcessor(run, start_processing_workers=False)
    (metrics_to_process, skipped_metrics) = test_processor.split_by_last_seconds(
        metrics
    )

    assert 4 == len(metrics_to_process)
    assert 0 == len(skipped_metrics)

    assert [
        {
            "timeStamp": 1633708360200,  # Friday, 8 October 2021 15:52:40.200
        },
        {
            "timeStamp": 1633708362600,  # Friday, 8 October 2021 15:52:42.600
        },
        {
            "timeStamp": 1633708363609,  # Friday, 8 October 2021 15:52:43.609
        },
        {
            "timeStamp": 1633708363999,  # Friday, 8 October 2021 15:52:43.999
        },
    ] == metrics_to_process


def test_split_by_last_seconds_default_skip_last_1_second():

    run = "1-2-3"

    metrics = [
        {
            "timeStamp": 1633708360200,  # Friday, 8 October 2021 15:52:40.200
        },
        {
            "timeStamp": 1633708363609,  # Friday, 8 October 2021 15:52:43.609
        },
        {
            "timeStamp": 1633708362600,  # Friday, 8 October 2021 15:52:42.600
        },
        {
            "timeStamp": 1633708363999,  # Friday, 8 October 2021 15:52:43.999
        },
    ]
    test_processor = RunMetricsProcessor(run, start_processing_workers=False)

    (metrics_to_process, skipped_metrics) = test_processor.split_by_last_seconds(
        metrics, skip_seconds=1
    )

    assert 2 == len(metrics_to_process)
    assert 2 == len(skipped_metrics)

    assert [
        {
            "timeStamp": 1633708360200,  # Friday, 8 October 2021 15:52:40.200
        },
        {
            "timeStamp": 1633708362600,  # Friday, 8 October 2021 15:52:42.600
        },
    ] == metrics_to_process

    assert [
        {
            "timeStamp": 1633708363609,  # Friday, 8 October 2021 15:52:43.609
        },
        {
            "timeStamp": 1633708363999,  # Friday, 8 October 2021 15:52:43.999
        },
    ] == skipped_metrics


def test_split_by_last_seconds_default_skip_last_2_seconds():

    run = "1-2-3"

    metrics = [
        {
            "timeStamp": 1633708360200,  # Friday, 8 October 2021 15:52:40.200
        },
        {
            "timeStamp": 1633708363609,  # Friday, 8 October 2021 15:52:43.609
        },
        {
            "timeStamp": 1633708362600,  # Friday, 8 October 2021 15:52:43.600
        },
        {
            "timeStamp": 1633708363999,  # Friday, 8 October 2021 15:52:43.999
        },
    ]
    test_processor = RunMetricsProcessor(run, start_processing_workers=False)

    (metrics_to_process, skipped_metrics) = test_processor.split_by_last_seconds(
        metrics, skip_seconds=2
    )

    assert 1 == len(metrics_to_process)
    assert 3 == len(skipped_metrics)

    assert [
        {
            "timeStamp": 1633708360200,  # Friday, 8 October 2021 15:52:40.200
        },
    ] == metrics_to_process

    assert [
        {
            "timeStamp": 1633708362600,  # Friday, 8 October 2021 15:52:42.600
        },
        {
            "timeStamp": 1633708363609,  # Friday, 8 October 2021 15:52:43.609
        },
        {
            "timeStamp": 1633708363999,  # Friday, 8 October 2021 15:52:43.999
        },
    ] == skipped_metrics


def test_processing_worker_api_call(mocker):

    send_metrics = mocker.patch(
        "maestro_agent.services.maestro_api.run.RunApi.send_metrics"
    )
    mocker.patch("maestro_agent.logging.Logger.debug")

    run = "1-2-3"

    metrics = [
        {
            "timeStamp": 1633708360200,  # Friday, 8 October 2021 15:52:40.200
        },
        {
            "timeStamp": 1633708363609,  # Friday, 8 October 2021 15:52:43.609
        },
        {
            "timeStamp": 1633708362600,  # Friday, 8 October 2021 15:52:42.600
        },
        {
            "timeStamp": 1633708363999,  # Friday, 8 October 2021 15:52:43.999
        },
    ]
    test_processor = RunMetricsProcessor(run, start_processing_workers=True)
    test_processor.BULK_SIZE = 2  # send each two items to API

    for metric in metrics:
        test_processor.add_and_send(metric)

    # waiting for queue processing
    while test_processor.queue.empty() is False:
        pass

    test_processor.run_processing_workers = False

    # Metrics would not be sent to workers from last second
    # Since we have 2 items at the bulk size, only
    # last 2 items would be sent in the same bulk
    assert 3 == send_metrics.call_count

    # Metrics would be sent sorted by time
    assert call(run_id=run, metrics=[metrics[0]]) == send_metrics.call_args_list[0]

    assert call(run_id=run, metrics=[metrics[2]]) == send_metrics.call_args_list[1]

    assert (
        call(
            run_id=run,
            metrics=[
                metrics[1],
                metrics[3],
            ],
        )
        == send_metrics.call_args_list[2]
    )
