from maestro_agent.services.maestro_api.run import RunApi, RunStatus
from maestro_agent.services.agent.hooks import AgentHooks
from maestro_agent.logging import Logger

from maestro_agent.services.running_test import (
    RunningTestThreadsManager,
    wait_for_server_agents,
    prepare_for_running,
)


def handler(event, agent):
    run = RunApi.get(event.run_id)
    agent_hooks = AgentHooks(run.id, agent.id)
    try:
        agent_hooks.preparation_started()
        RunApi.update(run.id, run_status=RunStatus.CREATING.value)

        Logger.info(f"Preparing prerequisites to start a test run_id={run.id}")
        server_agents = wait_for_server_agents(run)

        Logger.info("Preparing prerequisites to start a test")
        prepare_for_running(run)

        Logger.info("Starting a test")
        running_test_threads = RunningTestThreadsManager.instance()
        running_test_threads.start_test(run=run, server_agents=server_agents)
        RunApi.update(run.id, run_status=RunStatus.RUNNING.value)
        agent_hooks.running()

        Logger.info("Test is running")
    except Exception as e:
        # Log errors with specific event type based logic
        print("exception caught")
        agent_hooks.error(str(e))
        RunApi.update(run.id, run_status=RunStatus.ERROR.value)
        raise e
