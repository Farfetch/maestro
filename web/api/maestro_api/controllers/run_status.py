from maestro_api.db.models.event import Event, EventType
from maestro_api.db.models.run import Run, RunStatus

from maestro_api.libs.flask.utils import (
    bad_request_response,
    get_obj_or_404,
    jsonify_list_of_docs,
)


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

    def start_one(self, run_id, user):
        """
        Start test run based on ID

        Available only for Runs with status: PENDING
        """
        run = get_obj_or_404(Run, id=run_id)

        # Only tests in PENDING state can be started
        if run.run_status != RunStatus.PENDING.value:
            return bad_request_response(
                "Run status is not '%s'" % RunStatus.PENDING.value
            )
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

    def restart_one(self, run_id, user):
        """
        Restart test run based on RunId.

        Execution metrics would be removed by client agent.
        """
        run = get_obj_or_404(Run, id=run_id)

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

    def stop_one(self, run_id, user):
        """
        Stop execution of Run

        Available only for Runs with status: PENDING CREATING, RUNNING
        Update RunStatus to STOPPED
        """
        run = get_obj_or_404(Run, id=run_id)

        # if pending events should be removed
        # for running test new event should be generated
        if run.run_status != RunStatus.RUNNING.value:
            return bad_request_response(
                "Run status is not '%s'" % RunStatus.RUNNING.value
            )

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

    def finish_one(self, run_id, user):
        """
        Send event that test is finished to server agents.

        Available only for Runs with status: RUNNING
        Update RunStatus to FINISHED
        """
        run = get_obj_or_404(Run, id=run_id)

        # Only running tests can go to the FINISHED state
        if run.run_status != RunStatus.RUNNING.value:
            return bad_request_response(
                "Run status is not '%s'" % RunStatus.RUNNING.value
            )

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
