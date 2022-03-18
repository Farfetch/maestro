import pytest
from maestro_api.db.repo.user import UserRepository
from maestro_api.db.models.workspace import Workspace
from maestro_api.db.models.user import User, UserRole


class TestUserRepository:
    @pytest.mark.parametrize(
        "users,input,expected_count",
        [
            ([], {"name": "User 1", "email": "user1@mail.com"}, 1),
            (
                [
                    {
                        "name": "User 1",
                        "email": "user1@mail.com",
                        "role": UserRole.ADMIN.value,
                    },
                    {
                        "name": "User 2",
                        "email": "user2@mail.com",
                        "role": UserRole.USER.value,
                    },
                ],
                {"name": "User another name", "email": "user1@mail.com"},
                2,
            ),
        ],
    )
    def test_create_or_update(self, app, users, input, expected_count):
        user_repo = UserRepository()

        for user in users:
            new_user = User(
                name=user["name"],
                email=user["email"],
                role=user["role"],
                workspace_ids=["6076d69ba216ff15b6e95ea8"],
            )
            new_user.save()

        user_repo.create_or_update(name=input["name"], email=input["email"])

        users = User.objects()

        updated_user = User.objects.get(email=input["email"])

        assert expected_count == len(users)
        assert input["name"] == updated_user.name
        assert input["email"] == updated_user.email
        assert updated_user.last_login_at

    def test_create_or_update_without_default_workspace(self, app, mocker):
        user_repo = UserRepository()
        name = "Admin User"
        email = "user1@maestro.test"
        created_user = user_repo.create_or_update(name=name, email=email)

        updated_user = User.objects.get(email=email)
        default_workspace = Workspace.objects.get(is_default=True)

        assert [default_workspace.id] == created_user.workspace_ids
        assert updated_user.id == created_user.id
        assert name == created_user.name
        assert email == created_user.email
        assert UserRole.USER.value == created_user.role

    def test_create_or_update_with_default_workspace(self, app, mocker):
        user_repo = UserRepository()
        name = "Admin User"
        email = "user1@maestro.test"

        workspace = Workspace(name="Some default workspace", is_default=True).save()

        created_user = user_repo.create_or_update(name=name, email=email)

        default_workspace = Workspace.objects.get(is_default=True)

        assert [default_workspace.id] == created_user.workspace_ids
        assert default_workspace.id == workspace.id
        assert default_workspace.name == workspace.name
