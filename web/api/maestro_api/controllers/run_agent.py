from maestro_api.db.models.run_agent import RunAgent

from maestro_api.libs.flask.utils import (
    get_obj_or_404,
    make_json_response,
    jsonify_list_of_docs,
)

from maestro_api.libs.utils import filter_dict_by_none_values


class RunAgentController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def update_one(self, data, user):
        "Update Run Agent object"

        run_id = data.get("run_id")
        agent_id = data.get("agent_id")

        agent_status = data.get("agent_status")
        error_message = data.get("error_message", "")

        run_agent = get_obj_or_404(RunAgent, run_id=run_id, agent_id=agent_id)

        run_agent.agent_status = agent_status
        run_agent.error_message = error_message

        return make_json_response(run_agent.to_json())

    def all(self, data, user):
        "Return list of RunAgent objects based on filters"

        filters = filter_dict_by_none_values(data)

        run_agents = RunAgent.objects(**filters)

        return jsonify_list_of_docs(run_agents)
