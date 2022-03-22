from maestro_api.db.models.user import User
from maestro_api.db.models.workspace import Workspace


from maestro_api.libs.flask.utils import (
    abort,
    jsonify_list_of_docs,
    get_obj_or_404,
    jsonify,
    bad_request_response,
)


class UserController:
    def __init__(self, flask_app=None):
        self.flask_app = flask_app

    def validate_is_user_exist(self, email, user_id=None):
        "Return Bad Request when user with following email exist"
        try:
            user = User.objects.get(email=email)
            if user_id is None or user.id != user_id:
                return abort(bad_request_response("User is already exist"))
        except User.DoesNotExist:
            pass

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
        user_to_update = get_obj_or_404(User, id=user_id)
        self.validate_is_user_exist(data.get("email"), user_to_update.id)

        updated_user = self.create_or_update_user(user_to_update, data)

        return jsonify(updated_user.to_dict())

    def create_one(self, data, user):
        "Create new User"
        self.validate_is_user_exist(data.get("email"))

        created_user = self.create_or_update_user(User(), data)

        return jsonify(created_user.to_dict())

    def get_me(self, user):
        res_user = get_obj_or_404(User, email=user["email"])

        return jsonify(res_user.to_dict())

    def delete_one(self, user_id, user):
        "Delete User by ID"

        user = get_obj_or_404(User, id=user_id)

        user.delete()

        return jsonify(user.to_dict())
