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

export const fetchAgents = async (filters = {}) => {
  try {
    const params = {
      params: {
        ...(filters.agent_status ? { agent_status: filters.agent_status } : {})
      }
    };
    const res = await maestroClient.get(`/api/agents`, params);

    const agents = res.data.map(agentObjectMapper);

    return agents;
  } catch (error) {
    ErrorHandler.handleError(error, "agents");
    throw error;
  }
};

export const fetchAgentById = async (agentId) => {
  try {
    const res = await maestroClient.get(`/api/agent/${agentId}`);

    const agents = agentObjectMapper(res.data);

    return agents;
  } catch (error) {
    ErrorHandler.handleError(error, `agent with the ID: ${agentId}`);
    throw error;
  }
};

export const updateAgent = async (agentId, params) => {
  try {
    const res = await maestroClient.put(`/api/agent/${agentId}`, params);

    const agent = agentObjectMapper(res.data);

    return agent;
  } catch (error) {
    ErrorHandler.handleError(error, "agent");
    throw error;
  }
};
