from mongoengine import (
    ObjectIdField,
    DateTimeField,
    IntField,
    StringField,
    EmbeddedDocumentField,
    EmbeddedDocument,
    ListField,
    Document,
)


class RunMetricLabelResponseCode(EmbeddedDocument):
    response_code = IntField(required=True)
    total_count = IntField(required=True)
    success_count = IntField(required=True)
    messages = ListField(StringField(unique=True))


class RunMetricLabel(Document):
    run_id = ObjectIdField()
    datetime = DateTimeField()
    label = StringField()
    success_count = IntField()
    total_count = IntField()
    latency_avg = IntField()
    latency_p50 = IntField()
    latency_p75 = IntField()
    latency_p90 = IntField()
    latency_p95 = IntField()
    latency_p99 = IntField()
    responses = ListField(
        field=EmbeddedDocumentField(RunMetricLabelResponseCode), default=[]
    )

    meta = {"indexes": ["run_id", "datetime", ("run_id", "datetime")]}

    def to_dict(self):
        return {
            "id": str(self.id),
            "run_id": str(self.run_id),
            "datetime": str(self.datetime),
            "label": self.label,
            "success_count": self.success_count,
            "total_count": self.total_count,
            "latency_avg": self.latency_avg,
            "latency_p50": self.latency_p50,
            "latency_p75": self.latency_p75,
            "latency_p90": self.latency_p90,
            "latency_p95": self.latency_p95,
            "latency_p99": self.latency_p99,
            "responses": [
                {
                    "response_code": response.response_code,
                    "total_count": response.total_count,
                    "success_count": response.success_count,
                    "messages": [message for message in response.messages],
                }
                for response in self.responses
            ],
        }
