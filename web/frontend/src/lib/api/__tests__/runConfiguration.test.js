import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import {
  createRunConfiguration,
  deleteRunConfiguration,
  fetchRunConfigurationById,
  fetchRunConfigurations,
  updateRunConfiguration
} from "../endpoints/runConfiguration";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/runConfiguration", () => {
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
    is_loadprofile_enabled: true,
    is_schedule_enabled: true,
    schedule: {
      days: ["Mon", "Tue"],
      time: "09:00"
    },
    created_at: "2021-04-14 12:29:20",
    updated_at: "2021-04-14 12:51:25"
  };

  const expectedData = {
    id: apiResponse.id,
    title: apiResponse.title,
    labels: ["label1"],
    customDataIds: apiResponse.custom_data_ids,
    hosts: apiResponse.hosts,
    agentIds: apiResponse.agent_ids,
    runPlanId: apiResponse.run_plan_id,
    customProperties: apiResponse.custom_properties,
    loadProfile: apiResponse.load_profile,
    isLoadProfileEnabled: apiResponse.is_loadprofile_enabled,
    isScheduleEnabled: apiResponse.is_schedule_enabled,
    schedule: apiResponse.schedule,
    createdAt: toLocalDate(apiResponse.created_at),
    updatedAt: toLocalDate(apiResponse.updated_at)
  };
  describe("fetchRunConfigurationById", () => {
    test("should return single object", async () => {
      const runConfigurationId = "1-2-3";

      axiosMock
        .onGet(`/api/run_configuration/${runConfigurationId}`)
        .reply(200, apiResponse);
      const data = await fetchRunConfigurationById(runConfigurationId);

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("createRunConfiguration", () => {
    test("should return single object", async () => {
      const dataToInsert = {
        customDataIds: apiResponse.custom_data_ids,
        hosts: apiResponse.hosts,
        agentIds: apiResponse.agent_ids,
        runPlanId: apiResponse.run_plan_id,
        customProperties: apiResponse.custom_properties
      };

      axiosMock
        .onPost(`/api/run_configuration`, {
          run_plan_id: dataToInsert.runPlanId,
          agent_ids: dataToInsert.agentIds,
          custom_data_ids: dataToInsert.customDataIds,
          hosts: dataToInsert.hosts,
          custom_properties: dataToInsert.customProperties
        })
        .reply(200, apiResponse);

      const data = await createRunConfiguration(dataToInsert);

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("updateRunConfiguration", () => {
    test("should return single object", async () => {
      const runConfigurationId = "1-2-3";
      const dataToUpdate = {
        customDataIds: apiResponse.custom_data_ids,
        hosts: apiResponse.hosts,
        agentIds: apiResponse.agent_ids,
        runPlanId: apiResponse.run_plan_id,
        customProperties: apiResponse.custom_properties
      };

      axiosMock
        .onPut(`/api/run_configuration/${runConfigurationId}`, {
          run_plan_id: dataToUpdate.runPlanId,
          agent_ids: dataToUpdate.agentIds,
          custom_data_ids: dataToUpdate.customDataIds,
          hosts: dataToUpdate.hosts,
          custom_properties: dataToUpdate.customProperties
        })
        .reply(200, apiResponse);

      const data = await updateRunConfiguration(
        runConfigurationId,
        dataToUpdate
      );

      expect(data).toStrictEqual(expectedData);
    });

    test("should disable configuration schedule", async () => {
      const runConfigurationId = "1-2-3";
      const dataToUpdate = {
        customDataIds: apiResponse.custom_data_ids,
        hosts: apiResponse.hosts,
        agentIds: apiResponse.agent_ids,
        runPlanId: apiResponse.run_plan_id,
        customProperties: apiResponse.custom_properties,
        isScheduleEnabled: true,
        schedule: {
          days: ["Mon"],
          time: "10:00"
        }
      };

      axiosMock
        .onPut(`/api/run_configuration/${runConfigurationId}`, {
          run_plan_id: dataToUpdate.runPlanId,
          agent_ids: dataToUpdate.agentIds,
          custom_data_ids: dataToUpdate.customDataIds,
          hosts: dataToUpdate.hosts,
          custom_properties: dataToUpdate.customProperties,
          is_schedule_enabled: dataToUpdate.isScheduleEnabled,
          schedule: dataToUpdate.schedule
        })
        .reply(200, apiResponse);

      const data = await updateRunConfiguration(
        runConfigurationId,
        dataToUpdate
      );

      expect(data).toStrictEqual(expectedData);
    });

    test("should disable load profiler", async () => {
      const runConfigurationId = "1-2-3";
      const dataToUpdate = {
        customDataIds: apiResponse.custom_data_ids,
        hosts: apiResponse.hosts,
        agentIds: apiResponse.agent_ids,
        runPlanId: apiResponse.run_plan_id,
        customProperties: apiResponse.custom_properties,
        loadProfile: apiResponse.load_profile,
        isLoadProfileEnabled: false
      };

      axiosMock
        .onPut(`/api/run_configuration/${runConfigurationId}`, {
          run_plan_id: dataToUpdate.runPlanId,
          agent_ids: dataToUpdate.agentIds,
          custom_data_ids: dataToUpdate.customDataIds,
          hosts: dataToUpdate.hosts,
          custom_properties: dataToUpdate.customProperties,
          load_profile: dataToUpdate.loadProfile,
          is_loadprofile_enabled: dataToUpdate.isLoadProfileEnabled
        })
        .reply(200, apiResponse);

      const data = await updateRunConfiguration(
        runConfigurationId,
        dataToUpdate
      );

      expect(data).toStrictEqual(expectedData);
    });
  });

  describe("fetchRunConfigurations", () => {
    test("should return list of objects", async () => {
      axiosMock.onGet("/api/run_configurations").reply(200, [apiResponse]);

      const data = await fetchRunConfigurations();

      expect(data).toStrictEqual([expectedData]);
    });
  });

  describe("deleteRunConfiguration", () => {
    test("should return single RunConfiugration object", async () => {
      const runConfigurationId = "1-2-3";
      axiosMock
        .onDelete(`/api/run_configuration/${runConfigurationId}`)
        .reply(200, apiResponse);

      const data = await deleteRunConfiguration(runConfigurationId);

      expect(data).toStrictEqual(expectedData);
    });
  });
});
