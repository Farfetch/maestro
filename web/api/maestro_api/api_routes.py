from flask import make_response


def init_api_routes(flask_app):
    @flask_app.route("/hello", methods=["GET"])
    def get_custom_data():
        "Hello endpoint"

        response = make_response({"test": 1})
        response.status_code = 200
        response.headers["Content-Type"] = "application/json"

        return response
