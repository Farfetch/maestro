from maestro_api.db.models.workspace import Workspace
from maestro_api.db.models.user import User, UserRole
from maestro_api.db.repo.run import RunRepository
from maestro_api.db.models.run import Run
from maestro_api.db.models.run_configuration import RunConfiguration


from maestro_api.libs.flask.utils import (
    jsonify_list_of_docs,
    get_obj_or_404,
    jsonify,
    bad_request_response,
)


class WorkspaceController:
    def __init__(self, flask_app=None):
        self.flask_app = flask_app
        self.run_repo = RunRepository()

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
        workspace = get_obj_or_404(Workspace, id=workspace_id)

        # Remove workspace from all users
        User.objects(workspace_ids__in=[workspace.id]).update(
            pull__workspace_ids=workspace.id
        )

        updated_workspace = self.create_or_update_workspace(workspace, data)

        return jsonify(updated_workspace.to_dict())

    def create_one(self, data, user):
        "Create new Workspace"

        created_workspace = self.create_or_update_workspace(Workspace(), data)

        return jsonify(created_workspace.to_dict())

    def delete_one(self, workspace_id, user):
        "Delete Workspace by ID"

        workspace = get_obj_or_404(Workspace, id=workspace_id)
        if workspace.is_default:
            return bad_request_response("Default workspace cannot be deleted")

        User.objects(workspace_ids__in=[workspace.id]).update(
            pull__workspace_ids=workspace.id
        )
        runs = Run.objects(workspace_id=workspace.id)
        for run in runs:
            self.run_repo.delete_with_related(run)
        RunConfiguration.objects(workspace_id=workspace.id).delete()

        workspace.delete()

        return jsonify(workspace.to_dict())
