from maestro_agent.app_state import ApplicationState
from maestro_agent.services.maestro_api.run import RunApi
from maestro_agent.logging import Logger
from maestro_agent.services.running_test.threads_manager import (
    RunningTestThreadsManager,
)


def handler(event, agent):
    run = RunApi.get(event.run_id)

    Logger.info(f"Stop running container... run_id={run.id}")
    Logger.debug(f"Creating running test threads manager for run={run.id}")

    running_test_threads = RunningTestThreadsManager.instance()
    running_test_threads.stop_test()

    Logger.debug(f"Stopping all running test threads run={run.id}")

    ApplicationState.available()
