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

    def start_one(self, run_id, user):
        """
        Start test run based on configuration
        """
        run = get_obj_or_404(Run, id=run_id)

        if run.run_status == RunStatus.RUNNING.value:
            return bad_request_response("Run is already running")

        all_events = []
        # Create Events to start server agents
        for server_agent_id in run.server_agent_ids:
            event = Event(
                event_type=EventType.START_SERVER_AGENT.value,
                run_id=run.id,
                agent_id=server_agent_id,
            ).save()
            all_events.append(event)

        # Create Event to start test
        start_run_event = Event(
            event_type=EventType.START_RUN.value,
            run_id=run.id,
            agent_id=run.client_agent_id,
        ).save()

        all_events.append(start_run_event)

        # Update Test run status to avoid generating a lot of events
        # The next status would be "RUNNING" setted up by agents
        run.run_status = RunStatus.PENDING.value
        run.save()

        return jsonify_list_of_docs(all_events)

    def stop_one(self, run_id, user):
        """Stop run that is in progress"""
        run = get_obj_or_404(Run, id=run_id)

        if run.run_status != RunStatus.RUNNING.value:
            return bad_request_response(
                "Run status is not '%s'" % RunStatus.RUNNING.value
            )

        all_events = []
        # Create Event to stop server agents
        for server_agent_id in run.server_agent_ids:
            event = Event(
                event_type=EventType.STOP_SERVER_AGENT.value,
                run_id=run.id,
                agent_id=server_agent_id,
            ).save()
            all_events.append(event)

        # Create Event to stop test
        start_test_event = Event(
            event_type=EventType.STOP_RUN.value,
            run_id=run.id,
            agent_id=run.client_agent_id,
        ).save()
        all_events.append(start_test_event)

        run.run_status = RunStatus.STOPPED.value
        run.save()

        return jsonify_list_of_docs(all_events)

    def finish_one(self, run_id, user):
        """
        Send event that test is finished to server agents.
        Updates Run status to "FINISHED"
        """
        run = get_obj_or_404(Run, id=run_id)

        if run.run_status != RunStatus.RUNNING.value:
            return bad_request_response(
                "Run status is not '%s'" % RunStatus.RUNNING.value
            )

        all_events = []
        # Create Event to stop server agents
        for server_agent_id in run.server_agent_ids:
            event = Event(
                event_type=EventType.STOP_SERVER_AGENT.value,
                run_id=run.id,
                agent_id=server_agent_id,
            ).save()
            all_events.append(event)

        run.run_status = RunStatus.FINISHED.value
        run.save()

        return jsonify_list_of_docs(all_events)
