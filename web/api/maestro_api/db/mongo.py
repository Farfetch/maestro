from mongoengine import connect


def init_db(flask_app=None):
    connect(**flask_app.config["MONGODB_SETTINGS"])
