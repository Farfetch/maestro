from mongoengine import StringField, BooleanField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import strftime


class Workspace(CreatedUpdatedDocumentMixin):

    name = StringField(required=True)
    is_default = BooleanField(required=True, default=False)

    def get_or_create_default():
        """
        Get or Create Defaulr workspace

        The default workspace is created as part of user login
        """
        try:
            workspace = Workspace.objects.get(is_default=True)
        except Workspace.DoesNotExist:
            workspace = Workspace(name="Default Space", is_default=True)
            workspace.save()
        return workspace

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "is_default": self.is_default,
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
