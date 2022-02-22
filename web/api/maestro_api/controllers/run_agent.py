from maestro_api.db.models.run_agent import RunAgent, RunAgentStatus
from maestro_api.db.models.run import Run

from maestro_api.libs.flask.utils import (
    get_obj_or_404,
    make_json_response,
    jsonify_list_of_docs,
)

from maestro_api.libs.utils import filter_dict_by_none_values


class RunAgentController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def update_run_status(self, run_id: str, agent_status: str):
        """
        Update run.run_status field if all RunAgent have the same
        """

        # Check if agent status one of the values that can update run_status
        if agent_status in [
            RunAgentStatus.RUNNING.value,
            RunAgentStatus.FINISHED.value,
            RunAgentStatus.ERROR.value,
        ]:
            run_agents = RunAgent.objects(run_id=run_id)
            update_run_status = True
            for run_agent in run_agents:
                if run_agent.agent_status != agent_status:
                    update_run_status = False
                    break

            if update_run_status is True:
                run = get_obj_or_404(Run, id=run_id)
                run.update_status(agent_status)
                run.save()
                return run

        return None

    def update_one(self, data, user):
        "Update Run Agent object"

        run_id = data.get("run_id")
        agent_id = data.get("agent_id")

        agent_status = data.get("agent_status")
        error_message = data.get("error_message", "")

        run_agent = get_obj_or_404(RunAgent, run_id=run_id, agent_id=agent_id)

        run_agent.agent_status = agent_status
        run_agent.error_message = error_message
        run_agent.save()

        self.update_run_status(run_id, agent_status)

        return make_json_response(run_agent.to_json())

    def all(self, data, user):
        "Return list of RunAgent objects based on filters"

        filters = filter_dict_by_none_values(data)

        run_agents = RunAgent.objects(**filters)

        return jsonify_list_of_docs(run_agents)
