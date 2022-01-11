import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import { fetchRunAgents } from "../endpoints/runAgent";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/runAgent", () => {
  test("should return list of agents", async () => {
    const id = "1-2-3";
    const agentId = "4-5-6";
    const runId = "7-8-9";
    const agentHostname = "test-host";
    const createdAtString = "2019-05-01 04:00:00";
    const updatedAtString = "2019-05-04 04:00:00";
    const agentStatus = "CREATING";
    const createdAt = toLocalDate(createdAtString);
    const updatedAt = toLocalDate(updatedAtString);

    axiosMock
      .onGet("/api/run_agents", {
        params: { run_id: runId }
      })
      .reply(200, [
        {
          id,
          run_id: runId,
          agent_id: agentId,
          agent_hostname: agentHostname,
          agent_status: agentStatus,
          created_at: createdAtString,
          updated_at: updatedAtString
        }
      ]);

    const data = await fetchRunAgents({ runId });

    expect(data).toStrictEqual([
      { id, agentId, runId, agentHostname, agentStatus, createdAt, updatedAt }
    ]);
  });
});
