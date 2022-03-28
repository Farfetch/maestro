from maestro_api.db.models.user import User, UserRole
from maestro_api.db.models.workspace import Workspace

from maestro_api.libs.datetime import now


class UserRepository:
    """
    Repository to manage User related operations
    """

    def create_or_update(self, name: str, email: str, role=UserRole.USER.value):
        try:
            user = User.objects.get(email=email)
            user.name = name
            user.role = role
            user.last_login_at = now()

        except User.DoesNotExist:
            default_workspace = Workspace.get_or_create_default()
            workspace_ids = [default_workspace.id]

            user = User(name=name, email=email, role=role, workspace_ids=workspace_ids)
        user.save()

        return user
