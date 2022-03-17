from mongoengine import FileField, StringField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import strftime


class CustomData(CreatedUpdatedDocumentMixin):
    custom_data_file = FileField()
    name = StringField(required=True)

    def to_dict(self):
        return {
            "id": str(self.id),
            "custom_data_file": str(self.custom_data_file),
            "name": self.name,
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
