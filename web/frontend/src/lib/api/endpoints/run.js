import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const runObjectMapper = (run) => ({
  id: run.id,
  title: run.title,
  customDataIds: run.custom_data_ids,
  hosts: run.hosts,
  clientAgentId: run.client_agent_id,
  serverAgentIds: run.server_agent_ids,
  runPlanId: run.run_plan_id,
  runStatus: run.run_status,
  customProperties: run.custom_properties,
  loadProfile: run.load_profile,
  createdAt: toLocalDate(run.created_at),
  updatedAt: toLocalDate(run.updated_at)
});

/**
 *
 * @param {string} runId
 * @returns
 */
export const fetchRunById = async (runId) => {
  // TODO: handle 404 errors
  const res = await maestroClient.get(`/api/run/${runId}`);

  const run = runObjectMapper(res.data);

  return run;
};

/**
 *
 * @param {String} runConfigurationId configuration to create a test
 * @returns run object
 */
export const createRun = async (runConfigurationId) => {
  const res = await maestroClient.post(`/api/run`, {
    run_configuration_id: runConfigurationId
  });

  const run = runObjectMapper(res.data);

  return run;
};

export const startRun = async (runId) => {
  const res = await maestroClient.post(`/api/run_status/${runId}/start`);

  const run = runObjectMapper(res.data);

  return run;
};

export const stopRun = async (runId) => {
  const res = await maestroClient.post(`/api/run_status/${runId}/stop`);

  const run = runObjectMapper(res.data);

  return run;
};

export const fetchRuns = async () => {
  const res = await maestroClient.get(`/api/runs`);

  const runs = res.data.map(runObjectMapper);

  return runs;
};
