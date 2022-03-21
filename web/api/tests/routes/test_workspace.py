import json


from maestro_api.db.models.workspace import Workspace
from maestro_api.db.models.user import User, UserRole


def test_workspace_all(client):

    name = "Workspace 1"

    Workspace(name=name, is_default=False).save()

    response = client.get(
        "/workspaces",
    )

    res_workspaces = json.loads(response.data)

    assert 1 == len(res_workspaces)

    assert name == res_workspaces[0]["name"]
    assert res_workspaces[0]["is_default"] is False
    assert "created_at" in res_workspaces[0]
    assert "updated_at" in res_workspaces[0]


def test_create_workspace(client):

    name = "Workspace 2"
    users_email = []

    request_data = {
        "name": name,
        "users_email": users_email,
    }
    response = client.post(
        "/workspace",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    assert 200 == response.status_code

    res = json.loads(response.data)

    assert name == res["name"]
    assert res["is_default"] is False
    assert "created_at" in res
    assert "updated_at" in res


def test_create_workspace_with_new_users(client):
    user_email = "workspace2@maestro.test"
    name = "Workspace 2"
    users_email = [user_email]

    request_data = {
        "name": name,
        "users_email": users_email,
    }
    response = client.post(
        "/workspace",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    created_users = User.objects.filter(email=user_email)
    default_workspace = Workspace.objects.get(is_default=True)

    assert 200 == response.status_code

    res = json.loads(response.data)

    assert 1 == len(created_users)

    user_workspace_ids = [
        str(workspace_id) for workspace_id in created_users[0].workspace_ids
    ]
    assert name == res["name"]
    assert res["is_default"] is False
    assert user_email == created_users[0].name
    assert user_email == created_users[0].email
    assert UserRole.USER.value == created_users[0].role
    assert res["id"] in user_workspace_ids
    assert str(default_workspace.id) in user_workspace_ids
    assert "created_at" in res
    assert "updated_at" in res


def test_create_workspace_with_exist_users(client):
    user_name = "some user email"
    user_role = UserRole.ADMIN.value
    user_email = "workspace2@maestro.test"
    name = "Workspace 2"
    users_email = [user_email]

    request_data = {
        "name": name,
        "users_email": users_email,
    }
    default_workspace = Workspace(name="Default", is_default=True).save()
    workspace1 = Workspace(name="Workspace 1", is_default=False).save()

    User(
        name=user_name,
        email=user_email,
        role=user_role,
        workspace_ids=[default_workspace.id, workspace1.id],
    ).save()

    response = client.post(
        "/workspace",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    created_users = User.objects.filter(email=user_email)

    assert 200 == response.status_code

    res = json.loads(response.data)

    assert 1 == len(created_users)

    user_workspace_ids = [
        str(workspace_id) for workspace_id in created_users[0].workspace_ids
    ]
    assert name == res["name"]
    assert res["is_default"] is False
    assert user_name == created_users[0].name
    assert user_email == created_users[0].email
    assert user_role == created_users[0].role
    assert res["id"] in user_workspace_ids
    assert str(default_workspace.id) in user_workspace_ids
    assert str(workspace1.id) in user_workspace_ids
    assert "created_at" in res
    assert "updated_at" in res


def test_update_workspace(client):
    workspace_id = "6076d1e3a216ff15b6e95e1f"
    name = "Workspace 2"
    users_email = []

    Workspace(id=workspace_id, name="Workspace 1").save()

    request_data = {
        "name": name,
        "users_email": users_email,
    }
    response = client.put(
        f"/workspace/{workspace_id}",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    assert 200 == response.status_code

    res = json.loads(response.data)

    assert name == res["name"]
    assert res["is_default"] is False
    assert "created_at" in res
    assert "updated_at" in res
