import mongoengine_goodjson as gj

from mongoengine import (
    ObjectIdField,
    DateTimeField,
    IntField,
    StringField,
    EmbeddedDocumentField,
    EmbeddedDocument,
    ListField,
)


class RunMetricLabelResponseCode(EmbeddedDocument):
    response_code = IntField(required=True)
    total_count = IntField(required=True)
    success_count = IntField(required=True)
    messages = ListField(StringField(unique=True))


class RunMetricLabel(gj.Document):
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
