from maestro_api.db.models.user import User, UserRole
from maestro_api.db.models.workspace import Workspace

from maestro_api.settings import AUTH_ADMIN_EMAIL
from maestro_api.libs.datetime import now


class UserRepository:
    """
    Repository to manage User related operations
    """

    def create_or_update(self, name: str, email: str):
        try:
            user = User.objects.get(email=email)
            user.name = name
            user.last_login_at = now()

        except User.DoesNotExist:
            role = (
                UserRole.ADMIN.value
                if email == AUTH_ADMIN_EMAIL
                else UserRole.USER.value
            )
            default_workspace = Workspace.get_or_create_default()

            user = User(
                name=name, email=email, role=role, workspace_ids=[default_workspace.id]
            )
        user.save()

        return user
