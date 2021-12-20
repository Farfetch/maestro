import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import { fetchRunPlans } from "../endpoints/runPlan";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/runPlan", () => {
  test("should return list of Run objects", async () => {
    const apiResponse = {
      id: "6076d1e3a216ff15b6e95e9d",
      run_plan_file: "6076d1e3a216ff15b6e95e9e",
      title: "Example test plan",
      created_at: "2021-04-14T12:28:35.875000",
      updated_at: "2021-04-14T12:28:35.939000"
    };

    const expectedData = {
      id: apiResponse.id,
      runPlanFile: apiResponse.run_plan_file,
      title: apiResponse.title,
      createdAt: toLocalDate(apiResponse.created_at),
      updatedAt: toLocalDate(apiResponse.updated_at)
    };

    axiosMock.onGet("/api/run_plans").reply(200, [apiResponse]);
    const data = await fetchRunPlans();

    expect(data).toStrictEqual([expectedData]);
  });
});
