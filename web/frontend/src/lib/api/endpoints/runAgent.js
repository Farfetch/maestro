import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const runAgentObjectMapper = (runAgent) => ({
  id: runAgent.id,
  agentId: runAgent.agent_id,
  runId: runAgent.run_id,
  agentHostname: runAgent.agent_hostname,
  agentStatus: runAgent.agent_status,
  createdAt: toLocalDate(runAgent.created_at),
  updatedAt: toLocalDate(runAgent.updated_at)
});

export const fetchRunAgents = async ({ runId }) => {
  const res = await maestroClient.get("/api/run_agents", {
    params: {
      run_id: runId
    }
  });

  const agents = res.data.map(runAgentObjectMapper);

  return agents;
};
