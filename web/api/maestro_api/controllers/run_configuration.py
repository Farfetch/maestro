from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run_plan import RunPlan
from maestro_api.db.models.custom_data import CustomData
from maestro_api.db.models.run_configuration import RunConfiguration

from maestro_api.libs.flask.utils import get_obj_or_404, jsonify_list_of_docs, jsonify


class RunConfigurationController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def _get_create_update_data(self, data):
        agent_ids = [
            get_obj_or_404(Agent, id=agent_id).id for agent_id in data.get("agent_ids")
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
        labels = data.get("labels", [])
        is_schedule_enabled = data.get("is_schedule_enabled", False)
        schedule = data.get("schedule", None)

        data_to_db = {
            "title": title,
            "agent_ids": agent_ids,
            "run_plan_id": run_plan.id,
            "hosts": hosts,
            "custom_data_ids": custom_data_ids,
            "custom_properties": custom_properties,
            "load_profile": load_profile,
            "labels": labels,
            "is_schedule_enabled": is_schedule_enabled,
        }

        if schedule is not None:
            data_to_db["schedule"] = schedule

        return data_to_db

    def get_one(self, run_configuration_id, user):
        "Get RunConfiguration by ID"

        run_configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)

        return jsonify(run_configuration.to_dict())

    def all(self, user):
        "Get all RunConfiguration objects"

        run_configurations = RunConfiguration.objects()

        return jsonify_list_of_docs(run_configurations)

    def create_one(self, data, user):
        """
        Create RunConfiguration object
        """

        data_to_insert = self._get_create_update_data(data)

        new_run_configuration = RunConfiguration(**data_to_insert).save()

        return jsonify(new_run_configuration.to_dict())

    def update_one(self, run_configuration_id, data, user):
        "Update RunConfiguration object by ID"

        run_configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)

        data_to_update = self._get_create_update_data(data)

        run_configuration.update(**data_to_update)
        run_configuration.reload()

        return jsonify(run_configuration.to_dict())

    def delete_one(self, run_configuration_id, user):
        "Delete RunConfiguration by ID"

        run_configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)

        run_configuration.delete()

        return jsonify(run_configuration.to_dict())
