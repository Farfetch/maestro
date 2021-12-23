from maestro_agent.services.jmeter.run_metrics import (
    RunMetricsCsvFileObserver,
)
from maestro_agent.settings import (
    JMETER_RUN_METRICS_PATH,
)


def collect_metrics_handler(finish, finished, failed, run):
    "Listens Jmeter results file and sends metrics to the Maestro API"
    try:
        metrics_file = JMETER_RUN_METRICS_PATH % run.id
        results_observer = RunMetricsCsvFileObserver(
            file_path=metrics_file, run_id=run.id, stop=finish
        )
        results_observer.start()
    except Exception as e:
        failed(e)
