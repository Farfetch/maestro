import json


from maestro_api.db.models.user import User, UserRole
from maestro_api.db.models.workspace import Workspace


def test_user_all(client):

    name = "User 1"
    email = "user1@maestro.test"
    workspace_ids = ["6076d1e3a216ff15b6e95e1f"]
    role = UserRole.ADMIN.value

    User(name=name, email=email, role=role, workspace_ids=workspace_ids).save()

    response = client.get(
        "/users",
    )

    res_users = json.loads(response.data)

    assert 1 == len(res_users)

    assert name == res_users[0]["name"]
    assert email == res_users[0]["email"]
    assert workspace_ids == res_users[0]["workspace_ids"]
    assert role == res_users[0]["role"]
    assert res_users[0]["last_login_at"] is None
    assert "created_at" in res_users[0]
    assert "created_at" in res_users[0]
    assert "updated_at" in res_users[0]


def test_create_user(client):

    name = "User 1"
    email = "user1@maestro.test"
    workspace_ids = ["6076d1e3a216ff15b6e95e1f"]
    role = UserRole.USER.value

    for workspace_id in workspace_ids:
        Workspace(id=workspace_id, name="Test").save()

    request_data = {
        "name": name,
        "email": email,
        "role": role,
        "workspace_ids": workspace_ids,
    }
    response = client.post(
        "/user",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    assert 200 == response.status_code

    res = json.loads(response.data)

    assert name == res["name"]
    assert email == res["email"]
    assert workspace_ids == res["workspace_ids"]
    assert role == res["role"]
    assert res["last_login_at"] is None
    assert "created_at" in res
    assert "created_at" in res
    assert "updated_at" in res


def test_update_user(client):

    user_id = "6076d1e3a216ff15b6e95e1d"
    name = "User 1"
    email = "user1@maestro.test"
    workspace_ids = ["6076d1e3a216ff15b6e95e1f"]
    role = UserRole.USER.value

    User(
        id=user_id,
        name="User 2",
        email="user2@maestro.test",
        role=UserRole.ADMIN.value,
        workspace_ids=["6076d1e3a216ff15b6e95e2f"],
    ).save()

    for workspace_id in workspace_ids:
        Workspace(id=workspace_id, name="Test").save()

    request_data = {
        "name": name,
        "email": email,
        "role": role,
        "workspace_ids": workspace_ids,
    }
    response = client.put(
        f"/user/{user_id}",
        data=json.dumps(request_data),
        content_type="application/json",
    )

    assert 200 == response.status_code

    res = json.loads(response.data)

    assert name == res["name"]
    assert email == res["email"]
    assert workspace_ids == res["workspace_ids"]
    assert role == res["role"]
    assert res["last_login_at"] is None
    assert "created_at" in res
    assert "created_at" in res
    assert "updated_at" in res
