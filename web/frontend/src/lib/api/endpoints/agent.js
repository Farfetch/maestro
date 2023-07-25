import ErrorHandler from "../../../ErrorHandler";
import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const agentObjectMapper = (agent) => ({
  id: agent.id,
  ip: agent.ip,
  hostname: agent.hostname,
  agentStatus: agent.agent_status,
  createdAt: toLocalDate(agent.created_at),
  updatedAt: toLocalDate(agent.updated_at)
});

export const fetchAgents = async () => {
  try {
    const res = await maestroClient.get("/api/agents");

    const agents = res.data.map(agentObjectMapper);

    return agents;
  } catch (error) {
    ErrorHandler.handleError(error, "agents");
    return [];
  }
};

export const fetchAgentById = async (agentId) => {
  try {
    const res = await maestroClient.get(`/api/agent/${agentId}`);

    const agents = agentObjectMapper(res.data);

    return agents;
  } catch (error) {
    ErrorHandler.handleError(error, `agent with the ID: ${agentId}`);
    return [];
  }
};
