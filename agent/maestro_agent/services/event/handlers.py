from maestro_agent.app_state import ApplicationState
from maestro_agent.services.maestro_api.run import RunApi
from maestro_agent.logging import Logger
from maestro_agent.services.agent.hooks import AgentHooks


from maestro_agent.services.running_test import (
    RunningTestThreadsManager,
    prepare_for_running,
)


class EventHandlerBase:
    event = None
    agent = None
    agent_hooks = None

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
            raise e

    def event_type_process(self):
        raise NotImplementedError(
            "`event_type_process` method should be called from base class"
        )


class StartRunEventHandler(EventHandlerBase):
    def event_type_process(self):
        self.agent_hooks.preparation_started()

        Logger.info("Preparing prerequisites to start a test")
        prepare_for_running(self.run)

        Logger.info("Starting a test")
        running_test_threads = RunningTestThreadsManager.instance()
        running_test_threads.start_test(run=self.run, agent=self.agent)

        self.agent_hooks.running()

        Logger.info("Test is running")


class StopRunEventHandler(EventHandlerBase):
    def event_type_process(self):
        Logger.info(f"Stop test execution. run_id={self.run.id}")

        running_test_threads = RunningTestThreadsManager.instance()
        running_test_threads.stop_test()

        Logger.info("Test stopped")

        ApplicationState.available()
