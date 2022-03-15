from mongoengine import FileField, StringField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import strftime


class RunPlan(CreatedUpdatedDocumentMixin):
    run_plan_file = FileField()
    title = StringField(required=True)

    def to_dict(self):
        return {
            "id": str(self.id),
            "run_plan_file": str(self.run_plan_file),
            "title": self.title,
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
