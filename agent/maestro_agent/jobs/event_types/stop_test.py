from maestro_agent.app_state import ApplicationState
from maestro_agent.services.maestro_api.run import RunApi
from maestro_agent.services.agent.hooks import AgentHooks
from maestro_agent.logging import Logger
from maestro_agent.services.running_test.threads_manager import (
    RunningTestThreadsManager,
)

# TODO: stop_server_agent and stop_test events are the same
#  Consider to simplify them and have just one handler for it


def handler(event, agent):
    run = RunApi.get(event.run_id)
    agent_hooks = AgentHooks(run.id, agent.id)

    try:
        Logger.info(f"Stop test execution. run_id={run.id}")

        running_test_threads = RunningTestThreadsManager.instance()
        running_test_threads.stop_test()

        Logger.info("Test stopped")

        ApplicationState.available()

    except Exception as e:
        # Log errors with specific event type based logic
        agent_hooks.error(str(e))
        raise e
