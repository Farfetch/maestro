from time import sleep
from maestro_cli.services.maestro_api.run import RunApi, RunStatus
from maestro_cli.services.maestro_api.run_metric import RunMetricApi

from maestro_cli.logging import Logger


def run_command(args):
    """
    Start test based on run_configuration_id from command line

    The command also monitors the status of created Run
      and provides regular feedback to the console.
    """

    def output_last_metric(run_id):
        metrics = RunMetricApi.all(run_id)

        if len(metrics) > 0:

            def sort_func(metric):
                return metric.min_datetime

            metrics.sort(key=sort_func, reverse=True)
            # Last metric is not accurate, use one before as last
            last_metric = metrics[1] if len(metrics) > 1 else 0

            total_count = last_metric.total_count
            success_count = last_metric.success_count
            errors = round(1 - success_count / total_count, 2)

            Logger.info(f"Hits: {total_count} req/s. Errors: {errors} %")
        else:
            Logger.info("Waiting for metrics....")

    def monitor_run_status(run_id):
        run = RunApi.get(run_id)

        if run.run_status == RunStatus.RUNNING.value:
            output_last_metric(run_id)
        else:
            Logger.info(f"Run status is '{run.run_status}'")
        if run.run_status not in [
            RunStatus.ERROR.value,
            RunStatus.FINISHED.value,
            RunStatus.STOPPED.value,
        ]:
            sleep(1)
            monitor_run_status(run_id)

    run_configuration_id = args.configuration_id
    run = RunApi.create(run_configuration_id)
    RunApi.start(run.id)  # Generate events to start a test

    Logger.info(f"Run started. run_id='{run.id}'")

    monitor_run_status(run.id)
