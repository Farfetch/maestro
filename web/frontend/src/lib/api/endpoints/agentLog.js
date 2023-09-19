import ErrorHandler from "../../../ErrorHandler";
import { toLocalDate, toUtcString } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import { agentLogLevel } from "../models";

const agentLogObjectMapper = (agentLog) => ({
  id: agentLog.id,
  agentId: agentLog.agent_id,
  logMessage: agentLog.log_message,
  level: agentLogLevel[agentLog.level],
  createdAt: toLocalDate(agentLog.created_at),
  updatedAt: toLocalDate(agentLog.updated_at)
});

/**
 *
 * @param {Moment} dateFrom // agentLog created at should be biiger than
 * @param {Array} agentIds
 * @returns
 */
export const fetchAgentLogs = async ({
  dateFrom,
  levels = [],
  agentIds = []
}) => {
  try {
    const res = await maestroClient.get("/api/agent_logs", {
      params: {
        date_from: toUtcString(dateFrom),
        log_levels: levels,
        agent_ids: agentIds
      }
    });

    const agentLogs = res.data.map(agentLogObjectMapper);

    return agentLogs;
  } catch (error) {
    ErrorHandler.handleError(error, "agent logs");
    throw error;
  }
};

export const clearAgentLog = async (agentId) => {
  try {
    const res = await maestroClient.delete(`/api/agent_log/${agentId}`);

    const numDeleteLogs = res.data;

    return numDeleteLogs;
  } catch (error) {
    ErrorHandler.handleError(error, "agent logs");
    throw error;
  }
};
