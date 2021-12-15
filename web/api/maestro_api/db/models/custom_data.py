import mongoengine_goodjson as gj
from mongoengine import FileField, StringField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin


class CustomData(CreatedUpdatedDocumentMixin, gj.Document):
    custom_data_file = FileField()
    name = StringField(required=True)
