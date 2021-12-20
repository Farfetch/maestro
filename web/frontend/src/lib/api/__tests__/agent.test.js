import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import { fetchAgents } from "../endpoints/agent";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/agent", () => {
  test("should return list of agents", async () => {
    const id = "1-2-3";
    const ip = "test-ip";
    const hostname = "test-host";
    const createdAtString = "2019-05-01 04:00:00";
    const updatedAtString = "2019-05-04 04:00:00";
    const agentStatus = "CREATING";
    const createdAt = toLocalDate(createdAtString);
    const updatedAt = toLocalDate(updatedAtString);

    axiosMock.onGet("/api/agents").reply(200, [
      {
        id,
        ip,
        hostname,
        created_at: createdAtString,
        updated_at: updatedAtString,
        agent_status: agentStatus
      }
    ]);
    const data = await fetchAgents();

    expect(data).toStrictEqual([
      { id, ip, hostname, agentStatus, createdAt, updatedAt }
    ]);
  });
});
