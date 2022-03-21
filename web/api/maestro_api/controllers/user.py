from maestro_api.db.models.user import User
from maestro_api.db.models.workspace import Workspace


from maestro_api.libs.flask.utils import jsonify_list_of_docs, get_obj_or_404, jsonify


class UserController:
    def __init__(self, flask_app=None):
        self.flask_app = flask_app

    def create_or_update_user(self, user, data):
        workspaces = [
            get_obj_or_404(Workspace, id=workspace_id)
            for workspace_id in data.get("workspace_ids")
        ]
        user.name = data.get("name")
        user.email = data.get("email")
        user.role = data.get("role")
        user.workspace_ids = [workspace.id for workspace in workspaces]

        user.save()

        return user

    def all(self, user):
        "Get all User objects"

        users = User.objects()

        return jsonify_list_of_docs(users)

    def update_one(self, data, user_id, user):
        "Update User data by ID"

        updated_user = self.create_or_update_user(
            get_obj_or_404(User, id=user_id), data
        )

        return jsonify(updated_user.to_dict())

    def create_one(self, data, user):
        "Create new User"

        created_user = self.create_or_update_user(User(), data)

        return jsonify(created_user.to_dict())

    def get_me(self, user):
        res_user = get_obj_or_404(User, email=user["email"])

        return jsonify(res_user.to_dict())
