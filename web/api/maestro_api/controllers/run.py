from maestro_api.db.models.run import Run
from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run_agent import RunAgent
from maestro_api.db.models.run_metric import RunMetric
from maestro_api.db.models.run_configuration import RunConfiguration

from maestro_api.libs.flask.utils import (
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
        RunAgent.objects(run_id=run.id).delete()
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

        agent_ids = configuration.server_agent_ids + [configuration.client_agent_id]

        agents = Agent.objects(id__in=agent_ids)
        run_agents = [
            RunAgent(
                run_id=new_run.id, agent_id=agent.id, agent_hostname=agent.hostname
            )
            for agent in agents
        ]

        RunAgent.objects.insert(run_agents)

        return make_json_response(new_run.to_json())

    def update_one(self, run_id, data, user):
        "Update Run object by ID"

        run = get_obj_or_404(Run, id=run_id)

        run_status = data["run_status"]

        run.update_status(run_status)
        run.save()

        return make_json_response(run.to_json())
