import mongoengine_goodjson as gj
from mongoengine import (
    ObjectIdField,
    DateTimeField,
    IntField,
    StringField,
    BooleanField,
)


class RunMetric(gj.Document):
    run_id = ObjectIdField()
    datetime = DateTimeField()
    elapsed = IntField()
    label = StringField()
    response_code = IntField()
    response_message = StringField()
    thread_name = StringField()
    data_type = StringField()
    success = BooleanField()
    failure_message = StringField()
    bytes = IntField()
    sent_bytes = IntField()
    grp_threads = IntField()
    all_threads = IntField()
    url = StringField()
    latency = IntField()
    idle_time = IntField()
    connect = IntField()

    meta = {"indexes": ["run_id", "datetime", ("run_id", "datetime")]}
