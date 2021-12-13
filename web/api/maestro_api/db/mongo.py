from flask_mongoengine import MongoEngine


def init_db(flask_app=None):
    MongoEngine(flask_app)
