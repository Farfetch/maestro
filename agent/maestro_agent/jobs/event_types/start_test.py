from maestro_agent.app_state import ApplicationState
from maestro_agent.services.maestro_api.run import RunApi, RunStatus
from maestro_agent.logging import Logger

from maestro_agent.services.running_test import (
    RunningTestThreadsManager,
    wait_for_server_agents,
    prepare_for_running,
)


def handler(event, agent):
    Logger.info("Start running test")
    run = RunApi.get(event.run_id)

    Logger.info("Waiting for all server agents to start a test")
    server_agents = wait_for_server_agents(run)

    Logger.info("Preparing all needed resources to start a test")
    prepare_for_running(run)

    Logger.info(f"Updating running status run={run.id}")

    RunApi.update(run.id, run_status=RunStatus.RUNNING.value)

    Logger.debug(f"Creating running test threads manager for run={run.id}")

    ApplicationState.running_test()

    running_test_threads = RunningTestThreadsManager.instance()
    running_test_threads.start_test(run=run, server_agents=server_agents)

    Logger.debug(f"Running test threads started run={run.id}")

    Logger.info("Test is running...")
