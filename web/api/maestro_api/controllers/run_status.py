from maestro_api.db.models.event import Event, EventType, EventStatus
from maestro_api.db.models.run import Run, RunStatus
from maestro_api.db.models.run_metric import RunMetric
from maestro_api.db.models.run_agent import RunAgent, RunAgentStatus
from maestro_api.db.models.run_metric_label import RunMetricLabel

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

    def create_agent_events(self, run_id, agent_ids, event_type):

        all_events = []

        for agent_id in agent_ids:
            event = Event(
                event_type=event_type,
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

        all_events = self.create_agent_events(
            run.id, run.agent_ids, EventType.START_RUN.value
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

        Endpoint would reset RunStatus and RunAgentStatus to default one
            and remove all metrics that were available.
        Agents will receive general START_RUN, START_SERVER_RUN events
            to start a test.
        """

        run.update_status(RunStatus.PENDING.value)
        run.save()

        RunMetric.objects(run_id=run.id).delete()
        RunMetricLabel.objects(run_id=run.id).delete()
        RunAgent.objects(run_id=run.id).update(
            set__agent_status=RunAgentStatus.PROCESSING.value, set__error_message=""
        )

        all_events = self.create_agent_events(
            run.id, run.agent_ids, EventType.START_RUN.value
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

        all_events = self.create_agent_events(
            run.id, run.agent_ids, EventType.STOP_RUN.value
        )

        run.update_status(RunStatus.STOPPED.value)
        run.save()

        return jsonify_list_of_docs(all_events)

    @required_statuses(
        [
            RunStatus.RUNNING.value,
        ]
    )
    def finish_one(self, run, user):
        """
        Agent finished test.

        Endpoint doesn't send any events. Main responsibility is to listen
         for agents. If agents finished a test and mark test as finished
         once last agent finished.


        Available only for Runs with status: RUNNING
        Update RunStatus to FINISHED
        """

        # TODO: update status to finished only if this is the last agent

        run.update_status(RunStatus.FINISHED.value)
        run.save()

        # This endpoint doesn't generate any events
        return jsonify_list_of_docs([])
