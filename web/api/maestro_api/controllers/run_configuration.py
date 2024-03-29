import json
import base64
from io import BytesIO

from flask import send_file

from mongoengine import Q

from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run import Run
from maestro_api.db.models.run_plan import RunPlan
from maestro_api.db.models.custom_data import CustomData
from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.models.workspace import Workspace
from maestro_api.db.repo.run import RunRepository

from maestro_api.libs.flask.utils import get_obj_or_404, jsonify_list_of_docs, jsonify


class RunConfigurationController:
    def __init__(self, flask_app):
        self.flask_app = flask_app
        self.run_repo = RunRepository()

    def _get_create_update_data(self, data):
        agent_ids = [
            get_obj_or_404(Agent, id=agent_id).id for agent_id in data.get("agent_ids")
        ]

        run_plan = get_obj_or_404(RunPlan, id=data.get("run_plan_id"))
        workspace = get_obj_or_404(Workspace, id=data.get("workspace_id"))

        custom_data_ids = [
            get_obj_or_404(CustomData, id=custom_data_id).id
            for custom_data_id in data.get("custom_data_ids", [])
        ]

        title = data.get("title")
        hosts = data.get("hosts", [])
        custom_properties = data.get("custom_properties", [])
        load_profile = data.get("load_profile", [])
        is_load_profile_enabled = data.get("is_load_profile_enabled", True)
        labels = data.get("labels", [])
        is_schedule_enabled = data.get("is_schedule_enabled", False)
        schedule = data.get("schedule", None)

        data_to_db = {
            "title": title,
            "agent_ids": agent_ids,
            "run_plan_id": run_plan.id,
            "workspace_id": workspace.id,
            "hosts": hosts,
            "custom_data_ids": custom_data_ids,
            "custom_properties": custom_properties,
            "load_profile": load_profile,
            "is_load_profile_enabled": is_load_profile_enabled,
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

    def all(self, data, user):
        "Get all RunConfiguration objects"

        workspace_id = data.get("workspace_id", None)

        filter_query = Q()

        if workspace_id is not None:
            filter_query = filter_query & Q(workspace_id=workspace_id)

        run_configurations = RunConfiguration.objects.filter(filter_query)

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

        runs = Run.objects(run_configuration_id=run_configuration.id)
        for run in runs:
            self.run_repo.delete_with_related(run)

        run_configuration.delete()

        return jsonify(run_configuration.to_dict())

    def download(self, run_configuration_id, user):
        """
        Export a specific RunConfiguration as a JSON
        with run_plan and custom_data as binary
        """
        run_configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)

        data_to_export = run_configuration.to_dict()

        # Fetch the associated run_plan
        run_plan_id = data_to_export.get("run_plan_id")
        run_plan = get_obj_or_404(RunPlan, id=run_plan_id)

        run_plan_file_data = run_plan.run_plan_file.read()

        run_plan_file_base64 = base64.b64encode(run_plan_file_data).decode("utf-8")

        del data_to_export["run_plan_id"]

        run_plan_dict = {
            "id": run_plan_id,
            "title": run_plan.title,
            "run_file_content_type": run_plan.run_plan_file.content_type,
            "run_file_data_base64": run_plan_file_base64,
        }

        data_to_export["run_plan"] = run_plan_dict

        # Fetch the associated custom_data files
        custom_data_ids = data_to_export.get("custom_data_ids", [])
        custom_data_list = []

        for custom_data_id in custom_data_ids:
            custom_data = get_obj_or_404(CustomData, id=custom_data_id)
            custom_data_file_data = custom_data.custom_data_file.read()
            custom_data_file_base64 = base64.b64encode(custom_data_file_data).decode(
                "utf-8"
            )

            custom_data_dict = {
                "name": custom_data.name,
                "custom_data_file_base64": custom_data_file_base64,
                "custom_data_content_type": custom_data.custom_data_file.content_type,
            }
            custom_data_list.append(custom_data_dict)

        data_to_export["custom_data_files"] = custom_data_list

        # Generate a JSON string
        json_data = json.dumps(data_to_export, indent=2)

        # Generate a temporary file in memory
        temp_file = BytesIO(json_data.encode())

        download_title = data_to_export.get("title") + ".json"

        return send_file(
            temp_file,
            as_attachment=True,
            download_name=download_title,
            mimetype="application/json",
        )
