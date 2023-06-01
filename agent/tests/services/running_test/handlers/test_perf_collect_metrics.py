from maestro_agent.services.jmeter.run_metrics import (
    RunMetricsCsvFileObserver,
)
from maestro_agent.services.jmeter.run_metrics import RunMetricsProcessor
import time
import pytest
from maestro_agent.services.jmeter.run_metrics import RunMetricsDiagnostic


class TestStopper:
    STOP = False
    PROVOKED_STOP = False
    TIME_ELIPSED = 0
    _START_TIME = time.perf_counter()

    @staticmethod
    def stop():
        if time.perf_counter() - TestStopper._START_TIME > 2:
            TestStopper.TIME_ELIPSED = time.perf_counter() - TestStopper._START_TIME
            TestStopper.PROVOKED_STOP = True
            return True
        return False


@pytest.mark.skip(reason="Skip test for now")
def test_perf_collect_metrics(requests_mock):
    metrics_file = "tests/services/running_test/handlers/jmeter_sample_result"
    run_id = 1

    RunMetricsProcessor.BULK_SIZE = 50
    RunMetricsProcessor.PROCESSING_WORKERS = 5
    requests_mock.post(f"/api/run_metrics/{run_id}", status_code=200, json={})

    results_observer = RunMetricsCsvFileObserver(
        file_path=metrics_file, run_id=run_id, stop=TestStopper.stop
    )

    TestStopper.TIME_ELIPSED = time.perf_counter()
    try:
        results_observer.start()
    except Exception:
        assert False

    assert RunMetricsDiagnostic.TOTAL_METRICS_SENT == 2000
    assert RunMetricsDiagnostic.MAX_QUEUE_SIZE == 0
    assert RunMetricsDiagnostic._get_average_send_metrics_latency() < 0.1
