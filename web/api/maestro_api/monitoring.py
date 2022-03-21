from flask import jsonify


def init_monitoring(flask_app):
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
        """This is a function to handle the ready endpoint.

        Returns
        -------
        str
                Http response message
        int
                Http response status code, 200 is the app is ready and 503 if it is not.
        """

        return "", 200
