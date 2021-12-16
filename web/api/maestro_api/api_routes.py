from maestro_api.controllers.run import RunController
from maestro_api.controllers.run_status import RunStatusController
from maestro_api.controllers.run_configuration import RunConfigurationController
from maestro_api.controllers.run_metric import RunMetricController
from maestro_api.controllers.run_plan import RunPlanController
from maestro_api.controllers.agent import AgentController
from maestro_api.controllers.custom_data import CustomDataController
from maestro_api.controllers.agent_log import AgentLogController
from maestro_api.controllers.event import EventController


from maestro_api.validation_schemas import (
    create_run_schema,
    update_run_schema,
    run_configuration_create_schema,
    run_metric_all_schema,
    agent_create_schema,
    agent_update_schema,
    agent_log_create_schema,
    agent_log_list_schema,
    event_update_schema,
    event_list_schema,
)

from maestro_api.libs.flask.decorators import requires_auth, validate_request


def init_api_routes(flask_app):
    run_controller = RunController(flask_app)
    run_status_controller = RunStatusController(flask_app)
    run_configuration_controller = RunConfigurationController(flask_app)
    run_plan_controller = RunPlanController(flask_app)
    run_metric_controller = RunMetricController(flask_app)
    agent_controller = AgentController(flask_app)
    custom_data_controller = CustomDataController(flask_app)
    agent_log_controller = AgentLogController(flask_app)
    event_controller = EventController(flask_app)

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
    def run_all(*args, **kwargs):
        return run_controller.all(*args, **kwargs)

    # /run_status routes
    # TODO: change to single endpoint from where we can change run status
    @flask_app.route("/run_status/<run_id>/start", methods=["POST"])
    @requires_auth()
    def run_status_start(*args, **kwargs):
        return run_status_controller.start_one(*args, **kwargs)

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

    @flask_app.route("/run_configuration", methods=["POST"])
    @requires_auth()
    @validate_request(run_configuration_create_schema)
    def run_configuration_create_one(*args, **kwargs):
        return run_configuration_controller.create_one(*args, **kwargs)

    @flask_app.route("/run_configurations", methods=["GET"])
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

    @flask_app.route("/run_plan", methods=["POST"])
    @requires_auth()
    def run_plan_create_one(*args, **kwargs):
        return run_plan_controller.create_one(*args, **kwargs)

    @flask_app.route("/run_plan/<run_plan_id>/download", methods=["GET"])
    @requires_auth()
    def run_plan_download(*args, **kwargs):
        return run_plan_controller.download(*args, **kwargs)

    # /run_metric routes
    @flask_app.route("/run_metric/<run_id>", methods=["POST"])
    @requires_auth()
    @validate_request()
    def run_metric_create_many(*args, **kwargs):
        return run_metric_controller.create_many(*args, **kwargs)

    @flask_app.route("/run_metric/<run_id>", methods=["GET"])
    @requires_auth()
    @validate_request(run_metric_all_schema)
    def run_metric_all(*args, **kwargs):
        return run_metric_controller.all(*args, **kwargs)

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

    @flask_app.route("/custom_data", methods=["POST"])
    @requires_auth()
    def custom_data_create_one(*args, **kwargs):
        return custom_data_controller.create_one(*args, **kwargs)

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
