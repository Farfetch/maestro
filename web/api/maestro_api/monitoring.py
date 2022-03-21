from flask import jsonify


def init_monitoring_routes(flask_app):
    @flask_app.route("/monitoring/ping")
    def __ping():
        return "", 200

    @flask_app.route("/monitoring/pong")
    def __pong():
        def __inner():
            return {"dependencies": []}

        return jsonify(__inner())

    @flask_app.route("/monitoring/ready")
    def __ready():
        return "", 200
