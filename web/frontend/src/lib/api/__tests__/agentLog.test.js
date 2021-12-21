import moment from "moment";

import { toLocalDate, toUtcString } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import { fetchAgentLogs } from "../endpoints/agentLog";
import { agentLogLevel } from "../models";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/agentLog", () => {
  const level = agentLogLevel.INFO;
  const apiResponse = {
    id: "60aba084f9a88ed1a9fe4394",

    agent_id: "6077280d0c739b2adf6e5684",
    log_message:
      "agent_id=6077280d0c739b2adf6e5684, ip=127.0.0.1, hostname=FFPTM2C70TTLVDN",
    level,
    created_at: "2021-05-24 13:48:04",
    updated_at: "2021-05-24 13:48:04"
  };
  const expectedData = {
    id: apiResponse.id,
    agentId: apiResponse.agent_id,
    logMessage: apiResponse.log_message,
    level,
    createdAt: toLocalDate(apiResponse.created_at),
    updatedAt: toLocalDate(apiResponse.updated_at)
  };
  test("should return list of agent logs", async () => {
    const dateFrom = moment("2018-05-24T13:48:04.313000");

    axiosMock
      .onGet("/api/agent_logs", {
        params: { date_from: toUtcString(dateFrom), level, agent_ids: [] }
      })
      .reply(200, [apiResponse]);

    const customDataRes = await fetchAgentLogs({ dateFrom, level });

    expect(customDataRes).toStrictEqual([expectedData]);
  });

  test("should return list of agent logs with agentIds filter", async () => {
    const dateFrom = moment("2018-05-24T13:48:04.313000");
    const agentIds = ["6077280d0c739b2adf6e5684"];

    axiosMock
      .onGet("/api/agent_logs", {
        params: {
          date_from: toUtcString(dateFrom),
          level,
          agent_ids: agentIds
        }
      })
      .reply(200, [apiResponse]);

    const customDataRes = await fetchAgentLogs({ dateFrom, level, agentIds });

    expect(customDataRes).toStrictEqual([expectedData]);
  });

  test("should return empty array", async () => {
    const dateFrom = moment("2018-05-24T13:48:04.313000");

    axiosMock
      .onGet("/api/agent_logs", {
        params: { date_from: toUtcString(dateFrom), level, agent_ids: [] }
      })
      .reply(200, []);

    const customDataRes = await fetchAgentLogs({ dateFrom, level });

    expect(customDataRes).toStrictEqual([]);
  });
});
