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


def test_workspace_delete(client):
    workspace_id = "6076d1e3a216ff15b6e95e1f"
    default_workspace_id = "6076d1e3a216ff15b6e95e1d"
    name = "Workspace 2"

    Workspace(id=workspace_id, name=name).save()
    Workspace(id=default_workspace_id, is_default=True, name="Default workspace").save()
    User(
        name="test",
        email="email@maestro.net",
        role=UserRole.USER.value,
        workspace_ids=[workspace_id, default_workspace_id],
    ).save()
    User(
        name="test 2",
        email="email2@maestro.net",
        role=UserRole.USER.value,
        workspace_ids=[workspace_id, default_workspace_id],
    ).save()

    response = client.delete(
        f"/workspace/{workspace_id}",
        content_type="application/json",
    )
    all_workspaces = Workspace.objects(id=workspace_id)
    all_users = User.objects(workspace_ids__in=[workspace_id])

    assert 200 == response.status_code

    res = json.loads(response.data)

    assert 0 == len(all_workspaces)
    assert 0 == len(all_users)
    assert name == res["name"]
    assert res["is_default"] is False
    assert "created_at" in res
    assert "updated_at" in res
