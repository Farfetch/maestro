from mongoengine import StringField, DateTimeField, ObjectIdField, ListField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import strftime
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
    workspace_ids = ListField(
        required=True,
        field=ObjectIdField(),
    )
    role = StringField(
        required=True,
        choices=UserRole.list(),
    )
    last_login_at = DateTimeField()

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "workspace_ids": [str(workspace_id) for workspace_id in self.workspace_ids],
            "last_login_at": strftime(self.last_login_at)
            if self.last_login_at
            else None,
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
