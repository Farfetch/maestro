import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import {
  createRun,
  fetchRunById,
  fetchRuns,
  startRun,
  stopRun
} from "../endpoints/run";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/run", () => {
  const apiResponse = {
    id: "6076d210a216ff15b6e95ea0",
    title: "Some test title",
    custom_data_ids: [],
    hosts: [],
    client_agent_id: "6076d152b28b871d6bdb604f",
    server_agent_ids: [
      "6076d1bfb28b871d6bdb6095",
      "6076d1c5b28b871d6bdb609c",
      "6076d1cbb28b871d6bdb60a1"
    ],
    run_plan_id: "6076d1e3a216ff15b6e95e9d",
    run_configuration_id: "6076d1e3a216ff15b6e95e2q",
    run_status: "PENDING",
    custom_properties: [
      {
        name: "propertyName",
        value: "randomValue"
      }
    ],
    load_profile: {
      start: 10,
      end: 20,
      duration: 100
    },
    created_at: "2021-04-14 12:29:20",
    updated_at: "2021-04-14 12:51:25",
    started_at: "2021-04-14 12:29:20",
    finished_at: "2021-04-14 12:51:25"
  };

  const expectedData = {
    id: apiResponse.id,
    title: apiResponse.title,
    customDataIds: apiResponse.custom_data_ids,
    hosts: apiResponse.hosts,
    clientAgentId: apiResponse.client_agent_id,
    serverAgentIds: apiResponse.server_agent_ids,
    runPlanId: apiResponse.run_plan_id,
    runConfigurationId: apiResponse.run_configuration_id,
    runStatus: apiResponse.run_status,
    loadProfile: apiResponse.load_profile,
    customProperties: apiResponse.custom_properties,
    createdAt: toLocalDate(apiResponse.created_at),
    updatedAt: toLocalDate(apiResponse.updated_at),
    startedAt: toLocalDate(apiResponse.started_at),
    finishedAt: toLocalDate(apiResponse.finished_at)
  };
  describe("fetchRunById", () => {
    test("should return single object", async () => {
      const runId = "1-2-3";

      axiosMock.onGet(`/api/run/${runId}`).reply(200, apiResponse);
      const data = await fetchRunById(runId);

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("createRun", () => {
    test("should return single object", async () => {
      const runConfigurationId = "6076d210a216ff15b6e95ea0";

      axiosMock
        .onPost(`/api/run`, {
          run_configuration_id: runConfigurationId
        })
        .reply(200, apiResponse);

      const data = await createRun(runConfigurationId);

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("startRun", () => {
    test("should return single object", async () => {
      const runId = "1-2-3";

      axiosMock
        .onPost(`/api/run_status/${runId}/start`)
        .reply(200, apiResponse);

      const data = await startRun(runId);

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("stopRun", () => {
    test("should return single object", async () => {
      const runId = "1-2-3";

      axiosMock.onPost(`/api/run_status/${runId}/stop`).reply(200, apiResponse);

      const data = await stopRun(runId);

      expect(data).toStrictEqual(expectedData);
    });
  });
  describe("fetchRuns", () => {
    test("should return list of objects", async () => {
      axiosMock.onGet("/api/runs").reply(200, [apiResponse]);

      const data = await fetchRuns();

      expect(data).toStrictEqual([expectedData]);
    });
  });
});
