from mongoengine import (
    ObjectIdField,
    DateTimeField,
    IntField,
    StringField,
    BooleanField,
    Document,
)


class RunMetric(Document):
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

    def to_dict(self):
        return {
            "id": str(self.id),
            "run_id": str(self.run_id),
            "datetime": str(self.datetime),
            "elapsed": self.elapsed,
            "label": self.label,
            "response_code": self.response_code,
            "response_message": self.response_message,
            "thread_name": self.thread_name,
            "data_type": self.data_type,
            "success": self.success,
            "failure_message": self.failure_message,
            "bytes": self.bytes,
            "sent_bytes": self.sent_bytes,
            "grp_threads": self.grp_threads,
            "all_threads": self.all_threads,
            "url": self.url,
            "latency": self.latency,
            "idle_time": self.idle_time,
            "connect": self.connect,
        }
