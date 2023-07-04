import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import {
  createRun,
  deleteRun,
  fetchRunById,
  fetchRuns,
  startRun,
  stopRun,
  updateRun
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
    labels: ["label1"],
    agent_ids: [
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
    notes: "Running test notes",
    created_at: "2021-04-14 12:29:20",
    updated_at: "2021-04-14 12:51:25",
    started_at: "2021-04-14 12:29:20",
    finished_at: "2021-04-14 12:51:25"
  };

  const expectedData = {
    id: apiResponse.id,
    title: apiResponse.title,
    labels: ["label1"],
    customDataIds: apiResponse.custom_data_ids,
    hosts: apiResponse.hosts,
    agentIds: apiResponse.agent_ids,
    runPlanId: apiResponse.run_plan_id,
    runConfigurationId: apiResponse.run_configuration_id,
    runStatus: apiResponse.run_status,
    loadProfile: apiResponse.load_profile,
    isLoadProfileEnabled: apiResponse.is_load_profile_enabled,
    customProperties: apiResponse.custom_properties,
    notes: apiResponse.notes,
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

  describe("updateRun", () => {
    test("should update run notes", async () => {
      const runId = "1-2-3";
      const params = {
        notes: "Some new notes"
      };

      axiosMock.onPut(`/api/run/${runId}`, params).reply(200, apiResponse);

      const data = await updateRun(runId, params);

      expect(data).toStrictEqual(expectedData);
    });

    test("should update run labels", async () => {
      const runId = "1-2-3";
      const params = {
        labels: ["label 2"]
      };

      axiosMock.onPut(`/api/run/${runId}`, params).reply(200, apiResponse);

      const data = await updateRun(runId, params);

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("deleteRun", () => {
    test("should return single Run object", async () => {
      const runId = "1-2-3";
      axiosMock.onDelete(`/api/run/${runId}`).reply(200, apiResponse);

      const data = await deleteRun(runId);

      expect(data).toStrictEqual(expectedData);
    });
  });
});
