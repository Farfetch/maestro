import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import {
  createWorkspace,
  fetchWorkspaces,
  updateWorkspace
} from "../endpoints/workspace";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/workspace", () => {
  const apiResponse = [
    {
      id: "6076d210a216ff15b6e95ea0",
      name: "Test Workspace1",
      is_default: false,
      created_at: "2021-04-14 12:29:20",
      updated_at: "2021-04-14 12:51:25"
    }
  ];

  const expectedData = [
    {
      id: apiResponse[0].id,
      name: apiResponse[0].name,
      isDefault: apiResponse[0].is_default,
      createdAt: toLocalDate(apiResponse[0].created_at),
      updatedAt: toLocalDate(apiResponse[0].updated_at)
    }
  ];
  describe("fetchWorkspaces", () => {
    test("should return list of workspaces", async () => {
      axiosMock.onGet(`/api/workspaces`).reply(200, apiResponse);
      const data = await fetchWorkspaces();

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("createWorkspace", () => {
    test("should return single object", async () => {
      const createData = {
        name: "test",
        usersEmail: ["test2@maestro.net"]
      };
      axiosMock
        .onPost(`/api/workspace`, {
          name: createData.name,
          users_email: createData.usersEmail
        })
        .reply(200, apiResponse[0]);
      const data = await createWorkspace(createData);

      expect(data).toStrictEqual(expectedData[0]);
    });
  });

  describe("updateWorkspace", () => {
    test("should return single object", async () => {
      const workspaceId = "6076d210a216ff15b6e95ea0";
      const updateData = {
        name: "test",
        usersEmail: ["test2@maestro.net"]
      };
      axiosMock
        .onPut(`/api/workspace/${workspaceId}`, {
          name: updateData.name,
          users_email: updateData.usersEmail
        })
        .reply(200, apiResponse[0]);
      const data = await updateWorkspace(workspaceId, updateData);

      expect(data).toStrictEqual(expectedData[0]);
    });
  });
});
