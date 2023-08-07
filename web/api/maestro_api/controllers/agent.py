from maestro_api.db.models.agent import Agent
from mongoengine import Q
from maestro_api.libs.flask.utils import (
    get_obj_or_404,
    jsonify_list_of_docs,
    jsonify,
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

        return jsonify(agent.to_dict())

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

        return jsonify(agent.to_dict())

    def get_one(self, agent_id, user):
        """
        Get Agent object by ID
        """
        agent = get_obj_or_404(Agent, id=agent_id)

        return jsonify(agent.to_dict())

    def all(self, data, user):
        """
        Get list of Agents
        """

        agent_status = data.get("agent_status", None)
        skip = int(data.get("skip", 0))
        limit = int(data.get("limit", 1000))

        filter_query = Q()

        if agent_status is not None:
            filter_query = filter_query & Q(agent_status__ne=agent_status)

        agents = Agent.objects().filter(filter_query).skip(skip).limit(limit)

        return jsonify_list_of_docs(agents)
