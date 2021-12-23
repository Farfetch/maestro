from maestro_agent.app_state import ApplicationState
from maestro_agent.services.maestro_api.run import RunApi
from maestro_agent.logging import Logger
from maestro_agent.services.running_test import (
    RunningTestThreadsManager,
    prepare_for_running,
)


def handler(event, agent):
    Logger.info("Start running test")
    run = RunApi.get(event.run_id)

    Logger.info("Preparing all needed resources to start a test")
    prepare_for_running(run)

    Logger.debug(f"Creating running test threads manager for run={run.id}")

    ApplicationState.running_test()

    running_test_threads = RunningTestThreadsManager.instance()
    running_test_threads.start_server_agents(run=run, agent=agent)

    Logger.debug(f"Running test threads started run={run.id}")

    Logger.info("Test is running...")
