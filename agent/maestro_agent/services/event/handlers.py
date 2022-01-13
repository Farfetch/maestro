from maestro_agent.app_state import ApplicationState
from maestro_agent.services.maestro_api.run import RunApi, RunStatus
from maestro_agent.logging import Logger
from maestro_agent.services.agent.hooks import AgentHooks
from maestro_agent.services.running_test.files import RunningTestFiles

from maestro_agent.services.running_test import (
    RunningTestThreadsManager,
    wait_for_server_agents,
    prepare_for_running,
)


def required_statuses(run_statuses):
    "Skip the event if status doesn't match"

    def decorator(func):
        def wrapper(self, *args):
            if self.run.run_status not in run_statuses:
                Logger.info(
                    "Event to start an Agent skipped. run_status=%s"
                    % self.run.run_status
                )
                return None

            val = func(self, *args)

            return val

        return wrapper

    return decorator


class EventHandlerBase:

    event = None
    agent = None
    agent_hooks = None

    # Options that can be changed per each Event
    update_run_error_status = True

    def __init__(self, event, agent):
        agent_hooks = AgentHooks(event.run_id, agent.id)
        self.event = event
        self.agent = agent
        self.agent_hooks = agent_hooks

    def process(self):
        try:
            self.run = RunApi.get(self.event.run_id)
            self.event_type_process()
        except Exception as e:
            # Log errors with specific event type based logic
            self.agent_hooks.error(str(e))
            if self.update_run_error_status:
                RunApi.update(self.run.id, run_status=RunStatus.ERROR.value)
            raise e

    def event_type_process(self):
        raise NotImplementedError(
            "`event_type_process` method should be called from base class"
        )


class StartRunEventHandler(EventHandlerBase):
    @required_statuses([RunStatus.PENDING.value])
    def event_type_process(self):

        self.agent_hooks.preparation_started()
        RunApi.update(self.run.id, run_status=RunStatus.CREATING.value)

        Logger.info(f"Preparing prerequisites to start a test run_id={self.run.id}")
        server_agents = wait_for_server_agents(self.run)

        Logger.info("Preparing prerequisites to start a test")
        prepare_for_running(self.run)

        Logger.info("Starting a test")
        running_test_threads = RunningTestThreadsManager.instance()
        running_test_threads.start_test(run=self.run, server_agents=server_agents)
        RunApi.update(self.run.id, run_status=RunStatus.RUNNING.value)
        self.agent_hooks.running()

        Logger.info("Test is running")


class StartServerAgentEventHandler(EventHandlerBase):
    @required_statuses([RunStatus.PENDING.value, RunStatus.CREATING.value])
    def event_type_process(self):

        Logger.info(f"Preparing prerequisites to start a test run_id={self.run.id}")
        self.agent_hooks.preparation_started()
        prepare_for_running(self.run)

        Logger.info("Starting a test")
        running_test_threads = RunningTestThreadsManager.instance()
        running_test_threads.start_server_agents(run=self.run, agent=self.agent)
        self.agent_hooks.running()
        Logger.info("Test is running")


class StopRunEventHandler(EventHandlerBase):
    update_run_error_status = False

    def event_type_process(self):
        Logger.info(f"Stop test execution. run_id={self.run.id}")

        running_test_threads = RunningTestThreadsManager.instance()
        running_test_threads.stop_test()

        # Clean up all data that was created during test execution
        running_test_files = RunningTestFiles(run_id=self.run.id)
        running_test_files.clean_up_files()

        Logger.info("Test stopped")

        ApplicationState.available()


class StopServerAgentEventHandler(StopRunEventHandler):
    pass
