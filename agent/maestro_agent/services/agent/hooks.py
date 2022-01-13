from maestro_agent.services.maestro_api.run_agent import RunAgentApi, RunAgentStatus
from maestro_agent.app_state import ApplicationState


class AgentHooks:
    """
    Based on tests execution the following methods would be called accordingly.
    Methods created to have teh interface over agent work cycle.
    """

    run_id = None
    agent_id = None

    def __init__(self, run_id, agent_id):
        self.run_id = run_id
        self.agent_id = agent_id

    def preparation_started(self):
        RunAgentApi.update_status(
            self.run_id, self.agent_id, RunAgentStatus.PROCESSING.value
        )

    def running(self):
        "Triggered when client/server agents started a test"
        RunAgentApi.update_status(
            self.run_id, self.agent_id, RunAgentStatus.RUNNING.value
        )
        ApplicationState.running_test()

    def finished(self):
        RunAgentApi.update_status(
            self.run_id, self.agent_id, RunAgentStatus.FINISHED.value
        )

    def error(self, error_message):

        RunAgentApi.update_status(
            self.run_id, self.agent_id, RunAgentStatus.ERROR.value, error_message
        )
