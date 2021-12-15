from maestro_api.controllers.run import RunController
from maestro_api.controllers.run_status import RunStatusController
from maestro_api.validation_schemas import create_run_schema, update_run_schema
from maestro_api.libs.flask.decorators import requires_auth, validate_request


def init_api_routes(flask_app):
    run_controller = RunController(flask_app)
    run_status_controller = RunStatusController(flask_app)

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
