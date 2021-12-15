from maestro_api.controllers.run import RunController
from maestro_api.controllers.run_status import RunStatusController
from maestro_api.controllers.agent import AgentController
from maestro_api.controllers.agent_log import AgentLogController
from maestro_api.validation_schemas import (
    create_run_schema,
    update_run_schema,
    agent_create_schema,
    agent_update_schema,
    agent_log_create_schema,
    agent_log_list_schema,
)
from maestro_api.libs.flask.decorators import requires_auth, validate_request


def init_api_routes(flask_app):
    run_controller = RunController(flask_app)
    run_status_controller = RunStatusController(flask_app)
    agent_controller = AgentController(flask_app)
    agent_log_controller = AgentLogController(flask_app)

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
