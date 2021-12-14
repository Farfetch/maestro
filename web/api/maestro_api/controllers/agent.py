from maestro_api.db.models.agent import Agent

from maestro_api.libs.flask.utils import (
    bad_request_response,
    get_obj_or_404,
    jsonify_list_of_docs,
    make_json_response,
)


class AgentController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def create_or_update_one(self, data, user):
        """
        Create or update Aagent object by hostname
        Hostname should be unique across all agents. Agents received hostname
        during start before they start processing events.
        """

        hostname = data["hostname"]
        ip = data["ip"]

        try:
            agent = Agent.objects.get(hostname=hostname)
            agent.ip = ip
            agent.save()
        except Agent.DoesNotExist:
            agent = Agent(hostname=hostname, ip=ip).save()

        return make_json_response(agent.to_json())

    def update_one(self, agent_id, data, user):
        """
        Update Agent object by ID.
        Agents are responsible for calling this endpoint within 1min interval. Agents
        that are not making any requests to the API will be considered as UNAVAILABLE
        and not be used for tests execution.
        """
        agent = get_obj_or_404(Agent, id=agent_id)

        agent_status = data["agent_status"]

        if agent_status:
            agent.agent_status = agent_status
            agent = agent.save()

        return make_json_response(agent.to_json())

    def get_one(self, agent_id, user):
        """
        Get Agent object by ID
        """
        agent = get_obj_or_404(Agent, id=agent_id)

        return make_json_response(agent.to_json())

    def all(self, user):
        """
        Get list of Agents
        """
        agents = Agent.objects()

        return jsonify_list_of_docs(agents)
