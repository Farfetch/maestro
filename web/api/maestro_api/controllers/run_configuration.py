from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run_plan import RunPlan
from maestro_api.db.models.custom_data import CustomData
from maestro_api.db.models.run_configuration import RunConfiguration

from maestro_api.libs.flask.utils import (
    get_obj_or_404,
    jsonify_list_of_docs,
    make_json_response,
)


class RunConfigurationController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def get_one(self, run_configuration_id, user):
        "Get RunConfiguration by ID"

        run_configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)

        return make_json_response(run_configuration.to_json())

    def all(self, user):
        "Get all RunConfiguration objects"

        run_configurations = RunConfiguration.objects()

        return jsonify_list_of_docs(run_configurations)

    def create_one(self, data, user):
        """
        Create RunConfiguration object
        """

        # Validation if agents are valid and existed on the database
        client_agent = get_obj_or_404(Agent, id=data.get("client_agent_id"))
        server_agent_ids = [
            get_obj_or_404(Agent, id=server_agent_id).id
            for server_agent_id in data.get("server_agent_ids")
        ]
        run_plan = get_obj_or_404(RunPlan, id=data.get("run_plan_id"))
        custom_data_ids = [
            get_obj_or_404(CustomData, id=custom_data_id).id
            for custom_data_id in data.get("custom_data_ids", [])
        ]

        title = data.get("title")
        hosts = data.get("hosts", [])
        custom_properties = data.get("custom_properties", [])
        load_profile = data.get("load_profile", [])

        new_run_configuration = RunConfiguration(
            title=title,
            client_agent_id=client_agent.id,
            server_agent_ids=server_agent_ids,
            run_plan_id=run_plan.id,
            hosts=hosts,
            custom_data_ids=custom_data_ids,
            custom_properties=custom_properties,
            load_profile=load_profile,
        ).save()

        return make_json_response(new_run_configuration.to_json())

    def update_one(self, run_configuration_id, data, user):
        "Update RunConfiguration object by ID"

        run_configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)

        # Validation if agents are valid and existed on the database
        client_agent = get_obj_or_404(Agent, id=data.get("client_agent_id"))
        server_agent_ids = [
            get_obj_or_404(Agent, id=server_agent_id).id
            for server_agent_id in data.get("server_agent_ids")
        ]

        run_plan = get_obj_or_404(RunPlan, id=data.get("run_plan_id"))

        custom_data_ids = [
            get_obj_or_404(CustomData, id=custom_data_id).id
            for custom_data_id in data.get("custom_data_ids")
        ]
        title = data.get("title")
        hosts = data.get("hosts", [])
        custom_properties = data.get("custom_properties", [])
        load_profile = data.get("load_profile", [])

        run_configuration.update(
            title=title,
            client_agent_id=client_agent.id,
            server_agent_ids=server_agent_ids,
            run_plan_id=run_plan.id,
            hosts=hosts,
            custom_data_ids=custom_data_ids,
            custom_properties=custom_properties,
            load_profile=load_profile,
        )
        run_configuration.reload()

        return make_json_response(run_configuration.to_json())

    def delete_one(self, run_configuration_id, user):
        "Delete RunConfiguration by ID"

        run_configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)

        run_configuration.delete()

        return make_json_response(run_configuration.to_json())
