from maestro_api.controllers.run import RunController
from maestro_api.controllers.run_status import RunStatusController
from maestro_api.controllers.run_configuration import RunConfigurationController
from maestro_api.controllers.run_metric import RunMetricController
from maestro_api.controllers.run_agent import RunAgentController
from maestro_api.controllers.run_plan import RunPlanController
from maestro_api.controllers.run_log import RunLogController
from maestro_api.controllers.agent import AgentController
from maestro_api.controllers.custom_data import CustomDataController
from maestro_api.controllers.agent_log import AgentLogController
from maestro_api.controllers.event import EventController
from maestro_api.controllers.user import UserController
from maestro_api.controllers.workspace import WorkspaceController


from maestro_api.validation_schemas import (
    create_run_schema,
    update_run_schema,
    run_all_schema,
    run_configuration_all_schema,
    run_configuration_create_schema,
    run_metric_all_schema,
    run_agent_update_schema,
    run_agent_all_schema,
    run_plan_create_schema,
    run_plan_download_schema,
    agent_create_schema,
    agent_update_schema,
    agent_log_create_schema,
    agent_log_list_schema,
    custom_data_create_schema,
    event_update_schema,
    event_list_schema,
    user_create_or_update_schema,
    workspace_create_or_update_schema,
)

from maestro_api.libs.flask.decorators import requires_auth, validate_request


def init_api_routes(flask_app):
    run_controller = RunController(flask_app)
    run_status_controller = RunStatusController(flask_app)
    run_configuration_controller = RunConfigurationController(flask_app)
    run_plan_controller = RunPlanController(flask_app)
    run_metric_controller = RunMetricController(flask_app)
    run_log_controller = RunLogController(flask_app)
    run_agent_controller = RunAgentController(flask_app)
    agent_controller = AgentController(flask_app)
    custom_data_controller = CustomDataController(flask_app)
    agent_log_controller = AgentLogController(flask_app)
    event_controller = EventController(flask_app)
    user_controller = UserController(flask_app)
    workspace_controller = WorkspaceController(flask_app)

    # /run routes
    @flask_app.route("/run/<run_id>", methods=["DELETE"])
    @requires_auth()
    def run_delete_one(*args, **kwargs):
        return run_controller.delete_one(*args, **kwargs)

    @flask_app.route("/run/<run_id>", methods=["GET"])
    @requires_auth()
    def run_get_one(*args, **kwargs):
        return run_controller.get_one(*args, **kwargs)

    @flask_app.route("/run/<run_id>", methods=["PUT"])
    @requires_auth()
    @validate_request(update_run_schema)
    def run_update_one(*args, **kwargs):
        return run_controller.update_one(*args, **kwargs)

    @flask_app.route("/run", methods=["POST"])
    @requires_auth()
    @validate_request(create_run_schema)
    def run_create_one(*args, **kwargs):
        return run_controller.create_one(*args, **kwargs)

    @flask_app.route("/runs", methods=["GET"])
    @requires_auth()
    @validate_request(run_all_schema)
    def run_all(*args, **kwargs):
        return run_controller.all(*args, **kwargs)

    # /run_status routes
    @flask_app.route("/run_status/<run_id>/start", methods=["POST"])
    @requires_auth()
    def run_status_start(*args, **kwargs):
        return run_status_controller.start_one(*args, **kwargs)

    @flask_app.route("/run_status/<run_id>/restart", methods=["POST"])
    @requires_auth()
    def run_status_restart(*args, **kwargs):
        return run_status_controller.restart_one(*args, **kwargs)

    @flask_app.route("/run_status/<run_id>/stop", methods=["POST"])
    @requires_auth()
    def run_status_stop(*args, **kwargs):
        return run_status_controller.stop_one(*args, **kwargs)

    @flask_app.route("/run_status/<run_id>/finish", methods=["POST"])
    @requires_auth()
    def run_status_finish(*args, **kwargs):
        return run_status_controller.finish_one(*args, **kwargs)

    # /run_configuration routes
    @flask_app.route("/run_configuration/<run_configuration_id>", methods=["GET"])
    @requires_auth()
    def run_configuration_get_one(*args, **kwargs):
        return run_configuration_controller.get_one(*args, **kwargs)

    @flask_app.route("/run_configuration/<run_configuration_id>", methods=["PUT"])
    @requires_auth()
    @validate_request(run_configuration_create_schema)
    def run_configuration_update_one(*args, **kwargs):
        return run_configuration_controller.update_one(*args, **kwargs)

    @flask_app.route("/run_configuration/<run_configuration_id>", methods=["DELETE"])
    @requires_auth()
    def run_configuration_delete_one(*args, **kwargs):
        return run_configuration_controller.delete_one(*args, **kwargs)

    @flask_app.route(
        "/run_configuration/<run_configuration_id>/download", methods=["GET"]
    )
    @requires_auth()
    def run_configuration_download(*args, **kwargs):
        return run_configuration_controller.download(*args, **kwargs)

    @flask_app.route("/run_configuration", methods=["POST"])
    @requires_auth()
    @validate_request(run_configuration_create_schema)
    def run_configuration_create_one(*args, **kwargs):
        return run_configuration_controller.create_one(*args, **kwargs)

    @flask_app.route("/run_configurations", methods=["GET"])
    @validate_request(run_configuration_all_schema)
    @requires_auth()
    def run_configuration_all(*args, **kwargs):
        return run_configuration_controller.all(*args, **kwargs)

    # /run_plan routes
    @flask_app.route("/run_plans", methods=["GET"])
    @requires_auth()
    def run_plan_all(*args, **kwargs):
        return run_plan_controller.all(*args, **kwargs)

    @flask_app.route("/run_plan/<run_plan_id>", methods=["GET"])
    @requires_auth()
    def run_plan_get_one(*args, **kwargs):
        return run_plan_controller.get_one(*args, **kwargs)

    @flask_app.route("/run_plan_from_file", methods=["POST"])
    @requires_auth()
    def run_plan_create_one_from_file(*args, **kwargs):
        return run_plan_controller.create_one_from_file(*args, **kwargs)

    @flask_app.route("/run_plan_from_base64", methods=["POST"])
    @requires_auth()
    @validate_request(run_plan_create_schema)
    def run_plan_create_one_from_base64(*args, **kwargs):
        return run_plan_controller.create_one_from_base64(*args, **kwargs)

    @flask_app.route("/run_plan/<run_plan_id>/download", methods=["GET"])
    @requires_auth()
    @validate_request(run_plan_download_schema)
    def run_plan_download(*args, **kwargs):
        return run_plan_controller.download(*args, **kwargs)

    # /run_metric routes
    @flask_app.route("/run_metrics/<run_id>", methods=["POST"])
    @requires_auth()
    @validate_request()
    def run_metric_create_many(*args, **kwargs):
        return run_metric_controller.create_many(*args, **kwargs)

    @flask_app.route("/run_metrics/<run_id>", methods=["GET"])
    @requires_auth()
    @validate_request(run_metric_all_schema)
    def run_metric_all(*args, **kwargs):
        return run_metric_controller.all(*args, **kwargs)

    @flask_app.route("/run_metrics/<run_id>/download", methods=["GET"])
    @requires_auth()
    @validate_request(run_metric_all_schema)
    def run_metric_download(*args, **kwargs):
        return run_metric_controller.download(*args, **kwargs)

    # /run_logs routes
    @flask_app.route("/run_log", methods=["PUT"])
    @requires_auth()
    def run_log_update_one(*args, **kwargs):
        return run_log_controller.update_or_create_one(*args, **kwargs)

    @flask_app.route("/run_log/<run_id>/download", methods=["GET"])
    @requires_auth()
    def run_log_download(*args, **kwargs):
        return run_log_controller.download_by_run(*args, **kwargs)

    # /run_agent routes
    @flask_app.route("/run_agent", methods=["PUT"])
    @requires_auth()
    @validate_request(run_agent_update_schema)
    def run_agent_update_one(*args, **kwargs):
        return run_agent_controller.update_one(*args, **kwargs)

    @flask_app.route("/run_agents", methods=["GET"])
    @requires_auth()
    @validate_request(run_agent_all_schema)
    def run_agent_all(*args, **kwargs):
        return run_agent_controller.all(*args, **kwargs)

    # /agent routes
    @flask_app.route("/agent", methods=["PUT"])
    @requires_auth()
    @validate_request(agent_create_schema)
    def agent_create_or_update(*args, **kwargs):
        return agent_controller.create_or_update_one(*args, **kwargs)

    @flask_app.route("/agent/<agent_id>", methods=["PUT"])
    @requires_auth()
    @validate_request(agent_update_schema)
    def agent_update_one(*args, **kwargs):
        return agent_controller.update_one(*args, **kwargs)

    @flask_app.route("/agent/<agent_id>", methods=["GET"])
    @requires_auth()
    def agent_get_one(*args, **kwargs):
        return agent_controller.get_one(*args, **kwargs)

    @flask_app.route("/agents", methods=["GET"])
    @requires_auth()
    def agent_all(*args, **kwargs):
        return agent_controller.all(*args, **kwargs)

    # /agent_log routes
    @flask_app.route("/agent_log", methods=["POST"])
    @requires_auth()
    @validate_request(agent_log_create_schema)
    def agent_log_create_one(*args, **kwargs):
        return agent_log_controller.create_one(*args, **kwargs)

    @flask_app.route("/agent_logs", methods=["GET"])
    @requires_auth()
    @validate_request(agent_log_list_schema)
    def agent_log_all(*args, **kwargs):
        return agent_log_controller.all(*args, **kwargs)

    # /custom_data routes
    @flask_app.route("/custom_data", methods=["GET"])
    @requires_auth()
    def custom_data_all(*args, **kwargs):
        return custom_data_controller.all(*args, **kwargs)

    @flask_app.route("/custom_data/<custom_data_id>", methods=["GET"])
    @requires_auth()
    def custom_data_get_one(*args, **kwargs):
        return custom_data_controller.get_one(*args, **kwargs)

    @flask_app.route("/custom_data_from_file", methods=["POST"])
    @requires_auth()
    def custom_data_create_one_from_file(*args, **kwargs):
        return custom_data_controller.create_one_from_file(*args, **kwargs)

    @flask_app.route("/custom_data_from_base64", methods=["POST"])
    @requires_auth()
    @validate_request(custom_data_create_schema)
    def custom_data_create_one_from_base64(*args, **kwargs):
        return custom_data_controller.create_one_from_base64(*args, **kwargs)

    @flask_app.route("/custom_data/<custom_data_id>/download", methods=["GET"])
    @requires_auth()
    def custom_data_download(*args, **kwargs):
        return custom_data_controller.download_one(*args, **kwargs)

    # /event routes
    @flask_app.route("/event/<event_id>", methods=["PUT"])
    @requires_auth()
    @validate_request(event_update_schema)
    def event_update_one(*args, **kwargs):
        return event_controller.update_one(*args, **kwargs)

    @flask_app.route("/events", methods=["GET"])
    @requires_auth()
    @validate_request(event_list_schema)
    def event_get_all(*args, **kwargs):
        return event_controller.all(*args, **kwargs)

    # /user routes
    @flask_app.route("/users", methods=["GET"])
    @requires_auth()
    def user_get_all(*args, **kwargs):
        return user_controller.all(*args, **kwargs)

    @flask_app.route("/user/<user_id>", methods=["PUT"])
    @requires_auth()
    @validate_request(user_create_or_update_schema)
    def user_update_one(*args, **kwargs):
        return user_controller.update_one(*args, **kwargs)

    @flask_app.route("/user/<user_id>", methods=["DELETE"])
    @requires_auth()
    def user_delete_one(*args, **kwargs):
        return user_controller.delete_one(*args, **kwargs)

    @flask_app.route("/user", methods=["POST"])
    @requires_auth()
    @validate_request(user_create_or_update_schema)
    def user_create_one(*args, **kwargs):
        return user_controller.create_one(*args, **kwargs)

    @flask_app.route("/me", methods=["GET"])
    @requires_auth()
    def user_me(*args, **kwargs):
        return user_controller.get_me(*args, **kwargs)

    # /workspace routes
    @flask_app.route("/workspaces", methods=["GET"])
    @requires_auth()
    def workspace_get_all(*args, **kwargs):
        return workspace_controller.all(*args, **kwargs)

    @flask_app.route("/workspace/<workspace_id>", methods=["PUT"])
    @requires_auth()
    @validate_request(workspace_create_or_update_schema)
    def workspace_update_one(*args, **kwargs):
        return workspace_controller.update_one(*args, **kwargs)

    @flask_app.route("/workspace/<workspace_id>", methods=["DELETE"])
    @requires_auth()
    def workspace_delete_one(*args, **kwargs):
        return workspace_controller.delete_one(*args, **kwargs)

    @flask_app.route("/workspace", methods=["POST"])
    @requires_auth()
    @validate_request(workspace_create_or_update_schema)
    def workspace_create_one(*args, **kwargs):
        return workspace_controller.create_one(*args, **kwargs)
