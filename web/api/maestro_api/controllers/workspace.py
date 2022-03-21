from maestro_api.db.models.workspace import Workspace
from maestro_api.db.models.user import User, UserRole


from maestro_api.libs.flask.utils import jsonify_list_of_docs, get_obj_or_404, jsonify


class WorkspaceController:
    def __init__(self, flask_app=None):
        self.flask_app = flask_app

    def create_or_update_workspace(self, workspace, data):
        "Create Owrkspace and share it with Users"
        workspace.name = data.get("name")
        workspace.save()

        default_workspace = Workspace.get_or_create_default()

        for user_email in data.get("users_email"):
            try:
                user = User.objects.get(email=user_email)

                user.workspace_ids.append(workspace.id)

            except User.DoesNotExist:

                default_workspace = Workspace.get_or_create_default()
                workspace_ids = [default_workspace.id, workspace.id]

                user = User(
                    name=user_email,
                    email=user_email,
                    role=UserRole.USER.value,
                    workspace_ids=workspace_ids,
                )
            user.save()

        return workspace

    def all(self, user):
        "Get all Workspace objects"

        users = Workspace.objects()

        return jsonify_list_of_docs(users)

    def update_one(self, data, workspace_id, user):
        "Update Workspace data by ID"

        updated_workspace = self.create_or_update_workspace(
            get_obj_or_404(Workspace, id=workspace_id), data
        )

        return jsonify(updated_workspace.to_dict())

    def create_one(self, data, user):
        "Create new Workspace"

        created_workspace = self.create_or_update_workspace(Workspace(), data)

        return jsonify(created_workspace.to_dict())
