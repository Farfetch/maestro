from mongoengine import StringField, DateTimeField, ObjectIdField, ListField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import now, strftime
from maestro_api.libs.extended.enum import ExtendedEnum


class UserRole(ExtendedEnum):
    """
    The status is responsible to have general control over events and have
    distributed event based system
    """

    USER = "USER"
    ADMIN = "ADMIN"


class User(CreatedUpdatedDocumentMixin):

    name = StringField(required=True)
    email = StringField(required=True, unique=True)
    profile_img = StringField()
    workspace_ids = ListField(
        required=True,
        field=ObjectIdField(),
    )
    role = StringField(
        required=True,
        choices=UserRole.list(),
    )
    last_login_at = DateTimeField(required=True, default=now())

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "profile_img": self.profile_img,
            "workspace_ids": [str(workspace_id) for workspace_id in self.workspace_ids],
            "last_login_at": strftime(self.finished_at),
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
