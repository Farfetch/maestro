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
  const res = await maestroClient.get("/api/agents");

  const agents = res.data.map(agentObjectMapper);

  return agents;
};

export const fetchAgentById = async (agentId) => {
  const res = await maestroClient.get(`/api/agent/${agentId}`);

  const agents = agentObjectMapper(res.data);

  return agents;
};
