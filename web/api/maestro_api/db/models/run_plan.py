import mongoengine_goodjson as gj
from mongoengine import FileField, StringField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


class RunPlan(CreatedUpdatedDocumentMixin, gj.Document):
    run_plan_file = FileField()
    title = StringField(required=True)
