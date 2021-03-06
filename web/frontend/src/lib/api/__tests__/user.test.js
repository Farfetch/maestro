import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import {
  createUser,
  deleteUser,
  fetchMe,
  fetchUsers,
  updateUser
} from "../endpoints/user";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/run", () => {
  const apiResponse = {
    id: "6076d210a216ff15b6e95ea0",
    name: "Test User1",
    email: "test@maestro.net",
    role: "USER",
    workspace_ids: [
      "6076d1bfb28b871d6bdb6095",
      "6076d1c5b28b871d6bdb609c",
      "6076d1cbb28b871d6bdb60a1"
    ],
    created_at: "2021-04-14 12:29:20",
    updated_at: "2021-04-14 12:51:25",
    last_login_at: "2021-04-14 12:29:20"
  };

  const expectedData = {
    id: apiResponse.id,
    name: apiResponse.name,
    email: apiResponse.email,
    role: apiResponse.role,
    workspaceIds: apiResponse.workspace_ids,
    createdAt: toLocalDate(apiResponse.created_at),
    updatedAt: toLocalDate(apiResponse.updated_at),
    lastLoginAt: toLocalDate(apiResponse.last_login_at)
  };
  describe("fetchMe", () => {
    test("should return single object", async () => {
      axiosMock.onGet(`/api/me`).reply(200, apiResponse);
      const data = await fetchMe();

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("fetchUsers", () => {
    test("should return single object", async () => {
      axiosMock.onGet(`/api/users`).reply(200, [apiResponse]);
      const data = await fetchUsers();

      expect(data).toStrictEqual([expectedData]);
    });
  });

  describe("createUser", () => {
    test("should return single User object", async () => {
      const createData = {
        name: "test",
        email: "test2@maestro.net",
        role: "USER",
        workspaceIds: ["6076d210a216ff15b6e95ea1"]
      };
      axiosMock
        .onPost(`/api/user`, {
          name: createData.name,
          email: createData.email,
          role: createData.role,
          workspace_ids: createData.workspaceIds
        })
        .reply(200, apiResponse);
      const data = await createUser(createData);

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("updateUser", () => {
    test("should return single User object", async () => {
      const userId = "6076d210a216ff15b6e95ea0";
      const updateData = {
        name: "test",
        email: "test2@maestro.net",
        role: "USER",
        workspaceIds: ["6076d210a216ff15b6e95ea1"]
      };
      axiosMock
        .onPut(`/api/user/${userId}`, {
          name: updateData.name,
          email: updateData.email,
          role: updateData.role,
          workspace_ids: updateData.workspaceIds
        })
        .reply(200, apiResponse);
      const data = await updateUser(userId, updateData);

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("deleteUser", () => {
    test("should return single User object", async () => {
      const userId = "6076d210a216ff15b6e95ea0";

      axiosMock.onDelete(`/api/user/${userId}`).reply(200, apiResponse);
      const data = await deleteUser(userId);

      expect(data).toStrictEqual(expectedData);
    });
  });
});
