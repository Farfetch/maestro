from maestro_api.db.models.event import Event, EventStatus, EventType
from maestro_api.db.models.run import Run, RunStatus
from maestro_api.db.models.run_metric import RunMetric
from maestro_api.db.models.run_configuration import RunConfiguration

from maestro_api.libs.flask.utils import (
    bad_request_response,
    get_obj_or_404,
    jsonify_list_of_docs,
    make_json_response,
)


class RunController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def delete_one(self, run_id, user):
        "Delete Run and related metrics by ID"

        run = get_obj_or_404(Run, id=run_id)

        RunMetric.objects(run_id=run.id).delete()
        run.delete()

        return make_json_response(run.to_json())

    def get_one(self, run_id, user):
        "Get Single Run run by ID"

        run = get_obj_or_404(Run, id=run_id)

        return make_json_response(run.to_json())

    def all(self, user):
        "Get all Run objects"

        runs = Run.objects()

        return jsonify_list_of_docs(runs)

    def create_one(self, data, user):
        """
        Create new Run object based on run configuration ID

        Run itself is fully independant instance that will be used everywhere without
        `run_configuration`. Run configuration is used only as a template
        from where run object can be created.
        """

        run_configuration_id = data.get("run_configuration_id")

        configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)
        hosts = [host.to_mongo() for host in configuration.hosts]
        load_profile = [
            load_profile_step.to_mongo()
            for load_profile_step in configuration.load_profile
        ]

        custom_properties = [
            custom_property.to_mongo()
            for custom_property in configuration.custom_properties
        ]

        new_run = Run(
            title=configuration.title,
            run_configuration_id=configuration.id,
            client_agent_id=configuration.client_agent_id,
            server_agent_ids=configuration.server_agent_ids,
            run_plan_id=configuration.run_plan_id,
            custom_data_ids=configuration.custom_data_ids,
            load_profile=load_profile,
            hosts=hosts,
            custom_properties=custom_properties,
        ).save()

        return make_json_response(new_run.to_json())

    def update_one(self, run_id, data, user):
        "Update Run object by ID"

        run = get_obj_or_404(Run, id=run_id)

        run.run_status = data["run_status"]
        run = run.save()

        return make_json_response(run.to_json())

    def start_one(self, run_id, user):
        """
        Start test run based on configuration
        """
        run = get_obj_or_404(Run, id=run_id)

        if run.run_status == RunStatus.RUNNING.value:
            return bad_request_response("Test Run is already running")

        all_events = []
        # Create Events to start slave daemons
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
            agent_id=run.master_agent_id,
        ).save()

        all_events.append(start_run_event)

        # Update Test run status to avoid generating a lot of events
        # The next status would be "RUNNING" setted up by daemons
        run.run_status = RunStatus.PENDING.value
        run.save()

        return jsonify_list_of_docs(all_events)

    def stop_one(self, run_id, user):
        """
        Start test run based on configuration
        """
        run = get_obj_or_404(Run, id=run_id)

        if run.run_status == RunStatus.RUNNING.value:
            return bad_request_response("Test Run is already running")

        all_events = []
        # Create Events to start slave daemons
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
            agent_id=run.master_agent_id,
        ).save()

        all_events.append(start_run_event)

        # Update Test run status to avoid generating a lot of events
        # The next status would be "RUNNING" setted up by daemons
        run.run_status = RunStatus.PENDING.value
        run.save()

        return jsonify_list_of_docs(all_events)
