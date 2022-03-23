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


def test_user_me(app, client):

    name = "User 1"
    email = "user1@maestro.test"
    workspace_ids = ["6076d1e3a216ff15b6e95e1f"]
    role = UserRole.ADMIN.value

    app.config["MOCK_AUTH_CURRENT_USER_EMAIL"] = email
    User(name=name, email=email, role=role, workspace_ids=workspace_ids).save()

    response = client.get(
        "/me",
    )

    assert 200 == response.status_code

    res_user = json.loads(response.data)

    assert name == res_user["name"]
    assert email == res_user["email"]
    assert workspace_ids == res_user["workspace_ids"]
    assert role == res_user["role"]
    assert res_user["last_login_at"] is None
    assert "created_at" in res_user
    assert "updated_at" in res_user


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


def test_create_user_with_already_exist_email(client):

    name = "User 1"
    email = "user1@maestro.test"
    workspace_ids = ["6076d1e3a216ff15b6e95e1f"]
    role = UserRole.USER.value

    for workspace_id in workspace_ids:
        Workspace(id=workspace_id, name="Test").save()

    User(
        name=name,
        email=email,
        role=role,
        workspace_ids=["6076d1e3a216ff15b6e95e2f"],
    ).save()

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

    assert 400 == response.status_code


def test_update_user_with_already_exist_email(client):

    user_id = "6076d1e3a216ff15b6e95e1d"
    name = "User 1"
    email = "user1@maestro.test"
    workspace_ids = ["6076d1e3a216ff15b6e95e1f"]
    role = UserRole.USER.value

    for workspace_id in workspace_ids:
        Workspace(id=workspace_id, name="Test").save()

    User(
        name=name,
        email=email,
        role=role,
        workspace_ids=["6076d1e3a216ff15b6e95e2f"],
    ).save()

    User(
        id=user_id,
        name="User 2",
        email="user2@maestro.test",
        role=role,
        workspace_ids=["6076d1e3a216ff15b6e95e2f"],
    ).save()

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

    assert 400 == response.status_code


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


def test_user_delete(client):
    user_id = "6076d1e3a216ff15b6e95e1f"
    workspace_id = "6076d1e3a216ff15b6e95e1d"
    name = "User Name"

    Workspace(id=workspace_id, name="Default workspace").save()
    User(
        id=user_id,
        name=name,
        email="email@maestro.net",
        role=UserRole.USER.value,
        workspace_ids=[workspace_id],
    ).save()
    User(
        name="test 2",
        email="email2@maestro.net",
        role=UserRole.USER.value,
        workspace_ids=[workspace_id],
    ).save()

    response = client.delete(
        f"/user/{user_id}",
        content_type="application/json",
    )

    all_users = User.objects()

    assert 200 == response.status_code

    res = json.loads(response.data)

    assert 1 == len(all_users)
    assert user_id != all_users[0].id
    assert user_id == res["id"]
    assert name == res["name"]
    assert "created_at" in res
    assert "updated_at" in res
