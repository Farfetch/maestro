import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import { fetchCustomData, fetchCustomDataById } from "../endpoints/customData";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/customData", () => {
  const apiResponse = {
    id: "60a53da67fbd61913bb27b9c",
    custom_data_file: "60a53da67fbd61913bb27b9d",
    name: "countries_all",
    title: "Countries list",
    created_at: "2021-05-19T17:32:38.654000",
    updated_at: "2021-05-19T17:32:38.669000"
  };

  const expectedData = {
    id: "60a53da67fbd61913bb27b9c",
    customDataFile: "60a53da67fbd61913bb27b9d",
    name: "countries_all",
    title: "Countries list",
    createdAt: toLocalDate(apiResponse.created_at),
    updatedAt: toLocalDate(apiResponse.updated_at)
  };

  describe("fetchCustomData", () => {
    test("should return list of custom data elements", async () => {
      axiosMock.onGet("/api/custom_data").reply(200, [apiResponse]);

      const customDataRes = await fetchCustomData();

      expect(customDataRes).toStrictEqual([expectedData]);
    });
  });

  describe("fetchCustomDataById", () => {
    test("should return single object", async () => {
      const customdataId = "1-2-3";

      axiosMock
        .onGet(`/api/custom_data/${customdataId}`)
        .reply(200, apiResponse);
      const data = await fetchCustomDataById(customdataId);

      expect(data).toStrictEqual(expectedData);
    });
  });
});
