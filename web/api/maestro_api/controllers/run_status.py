from maestro_api.db.models.event import Event, EventType, EventStatus
from maestro_api.db.models.run import Run, RunStatus

from maestro_api.libs.flask.utils import (
    bad_request_response,
    get_obj_or_404,
    jsonify_list_of_docs,
)


def required_statuses(available_statuses):
    "Skip the event if status doesn't match"

    def decorator(func):
        def wrapper(self, run_id, user, *args):
            run = get_obj_or_404(Run, id=run_id)

            if run.run_status not in available_statuses:
                return bad_request_response(
                    "Run status should be one of %s" % str(available_statuses)
                )

            val = func(self, run, user, *args)

            return val

        return wrapper

    return decorator


class RunStatusController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def create_agent_events(self, run_id, agents):

        all_events = []

        for agent in agents:
            for agent_id in agent["ids"]:
                event = Event(
                    event_type=agent["event_type"],
                    run_id=run_id,
                    agent_id=agent_id,
                ).save()
                all_events.append(event)

        return all_events

    @required_statuses([RunStatus.PENDING.value])
    def start_one(self, run, user):
        """
        Start test run based on ID

        Available only for Runs with status: PENDING
        """

        server_agents = {
            "ids": run.server_agent_ids,
            "event_type": EventType.START_SERVER_AGENT.value,
        }
        client_agents = {
            "ids": [run.client_agent_id],
            "event_type": EventType.START_RUN.value,
        }
        all_events = self.create_agent_events(
            run.id,
            [server_agents, client_agents],
        )

        return jsonify_list_of_docs(all_events)

    @required_statuses(
        [
            RunStatus.FINISHED.value,
            RunStatus.STOPPED.value,
            RunStatus.ERROR.value,
        ]
    )
    def restart_one(self, run, user):
        """
        Restart test run based on RunId.

        Execution metrics would be removed by client agent.
        """

        server_agents = {
            "ids": run.server_agent_ids,
            "event_type": EventType.RESTART_SERVER_AGENT.value,
        }
        client_agents = {
            "ids": [run.client_agent_id],
            "event_type": EventType.RESTART_RUN.value,
        }
        all_events = self.create_agent_events(
            run.id,
            [server_agents, client_agents],
        )

        return jsonify_list_of_docs(all_events)

    @required_statuses(
        [
            RunStatus.PENDING.value,
            RunStatus.CREATING.value,
            RunStatus.RUNNING.value,
        ]
    )
    def stop_one(self, run, user):
        """
        Stop execution of Run

        Available only for Runs with status: PENDING CREATING, RUNNING
        Update RunStatus to STOPPED
        """

        # New Events to stop test would be created
        Event.objects(run_id=run.id, event_status=EventStatus.PENDING.value).delete()

        server_agents = {
            "ids": run.server_agent_ids,
            "event_type": EventType.STOP_SERVER_AGENT.value,
        }
        client_agents = {
            "ids": [run.client_agent_id],
            "event_type": EventType.STOP_RUN.value,
        }
        all_events = self.create_agent_events(
            run.id,
            [server_agents, client_agents],
        )

        run.run_status = RunStatus.STOPPED.value
        run.save()

        return jsonify_list_of_docs(all_events)

    @required_statuses(
        [
            RunStatus.RUNNING.value,
        ]
    )
    def finish_one(self, run, user):
        """
        Send event that test is finished to server agents.

        Available only for Runs with status: RUNNING
        Update RunStatus to FINISHED
        """

        server_agents = {
            "ids": run.server_agent_ids,
            "event_type": EventType.STOP_SERVER_AGENT.value,
        }

        all_events = self.create_agent_events(
            run.id,
            [server_agents],
        )

        run.run_status = RunStatus.FINISHED.value
        run.save()

        return jsonify_list_of_docs(all_events)
