from mongoengine import Q

from maestro_api.db.models.agent_log import AgentLog

from maestro_api.libs.flask.utils import (
    jsonify_list_of_docs,
    jsonify,
)
from maestro_api.libs.datetime import strptime
from maestro_api.libs.utils import str_to_list


class AgentLogController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def create_one(self, data, user):
        """
        Create AgentLog object
        """

        agent_id = data.get("agent_id")
        log_message = data.get("log_message")
        level = data.get("level")

        new_agent_log = AgentLog(
            agent_id=agent_id, log_message=log_message, level=level
        ).save()

        return jsonify(new_agent_log.to_dict())

    def all(self, data, user):
        """
        Return list of AgentLog objects
        """
        date_from = strptime(data.get("date_from"))
        agent_ids = data.get("agent_ids", None)
        log_levels = data.get("log_levels", None)
        sort = data.get("sort", "-created_at")

        filter_query = Q(created_at__gte=date_from)

        if agent_ids is not None:
            # Single agent values should be converted to list
            agent_ids_filter = (
                [agent_ids] if not isinstance(agent_ids, list) else agent_ids
            )
            filter_query = filter_query & Q(
                agent_id__in=agent_ids_filter,
            )

        if log_levels is not None:
            filter_query = filter_query & Q(level__in=str_to_list(log_levels))

        agent_logs = AgentLog.objects.filter(filter_query).order_by(sort)

        return jsonify_list_of_docs(agent_logs)

    def delete(self, agent_id, user):
        """
        Delete all AgentLog entries for a specific agent.
        """

        deleted_count = AgentLog.objects(agent_id=agent_id).delete()

        return jsonify(deleted_count)
