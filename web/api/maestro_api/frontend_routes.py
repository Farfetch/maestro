from flask import make_response, send_from_directory

from maestro_api.libs.flask.decorators import requires_auth

from maestro_api.settings import (
    FRONTEND_PUBLIC_DIR,
)


def init_frontend_routes(flask_app):

    # HAPROXY health-check to avoid auth redirect
    @flask_app.route("/", methods=["HEAD"])
    def head():
        response = make_response()
        return response

    @flask_app.route("/")
    @requires_auth(redirect_to_login=True)
    def base(user):
        return send_from_directory(FRONTEND_PUBLIC_DIR, "index.html")

    # Path for all the static files (compiled JS/CSS, etc.)
    @flask_app.route("/<path:path>")
    def public_files(path):
        return send_from_directory(FRONTEND_PUBLIC_DIR, path)

    @flask_app.errorhandler(404)
    @requires_auth(redirect_to_login=True)
    def handler_404(e, user):
        return send_from_directory(FRONTEND_PUBLIC_DIR, "index.html")

    return flask_app
