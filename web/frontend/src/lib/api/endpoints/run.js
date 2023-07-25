import ErrorHandler from "../../../ErrorHandler";
import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const runObjectMapper = (run) => ({
  id: run.id,
  title: run.title,
  customDataIds: run.custom_data_ids,
  hosts: run.hosts,
  agentIds: run.agent_ids,
  runPlanId: run.run_plan_id,
  runStatus: run.run_status,
  runConfigurationId: run.run_configuration_id,
  customProperties: run.custom_properties,
  loadProfile: run.load_profile,
  isLoadProfileEnabled: run.is_load_profile_enabled,
  notes: run.notes,
  labels: run.labels,
  createdAt: toLocalDate(run.created_at),
  updatedAt: toLocalDate(run.updated_at),
  startedAt: toLocalDate(run.started_at),
  finishedAt: toLocalDate(run.finished_at)
});

/**
 *
 * @param {string} runId
 * @returns
 */
export const fetchRunById = async (runId) => {
  try {
    const res = await maestroClient.get(`/api/run/${runId}`);

    const run = runObjectMapper(res.data);

    return run;
  } catch (error) {
    ErrorHandler.handleError(error, `run with the ID: ${runId}`);
    return [];
  }
};

/**
 *
 * @param {String} runConfigurationId configuration to create a test
 * @returns run object
 */
export const createRun = async (runConfigurationId) => {
  try {
    const res = await maestroClient.post(`/api/run`, {
      run_configuration_id: runConfigurationId
    });

    const run = runObjectMapper(res.data);

    return run;
  } catch (error) {
    ErrorHandler.handleError(error, "run");
    return [];
  }
};

export const startRun = async (runId) => {
  try {
    const res = await maestroClient.post(`/api/run_status/${runId}/start`);

    const run = runObjectMapper(res.data);

    return run;
  } catch (error) {
    ErrorHandler.handleError(error, "run");
    return [];
  }
};

export const stopRun = async (runId) => {
  try {
    const res = await maestroClient.post(`/api/run_status/${runId}/stop`);

    const run = runObjectMapper(res.data);

    return run;
  } catch (error) {
    ErrorHandler.handleError(error, "run");
    return [];
  }
};

export const restartRun = async (runId) => {
  try {
    const res = await maestroClient.post(`/api/run_status/${runId}/restart`);

    const run = runObjectMapper(res.data);

    return run;
  } catch (error) {
    ErrorHandler.handleError(error, "run");
    return [];
  }
};

export const fetchRuns = async (filters = {}) => {
  try {
    const params = {
      params: {
        ...(filters.workspaceId ? { workspace_id: filters.workspaceId } : {}),
        ...(filters.title ? { title: filters.title } : {}),
        ...(filters.run_status ? { run_status: filters.run_status } : {}),
        ...(filters.run_configuration_id
          ? { run_configuration_id: filters.run_configuration_id }
          : {})
      }
    };
    const res = await maestroClient.get(`/api/runs`, params);

    const runs = res.data.map(runObjectMapper);

    return runs;
  } catch (error) {
    ErrorHandler.handleError(error, "runs");
    return [];
  }
};

/**
 * NOTE: at least one of params is required
 * @param {RunStatus} run_status optional param to update status
 * @param {String} notes optional param to update notes
 * @returns {Run}
 */
export const updateRun = async (runId, params) => {
  try {
    const res = await maestroClient.put(`/api/run/${runId}`, params);

    const run = runObjectMapper(res.data);

    return run;
  } catch (error) {
    ErrorHandler.handleError(error, "run");
    return [];
  }
};

/**
 * @param {string} runId optional param to update status
 * @returns {Run}
 */
export const deleteRun = async (runId) => {
  try {
    const res = await maestroClient.delete(`/api/run/${runId}`);

    const run = runObjectMapper(res.data);

    return run;
  } catch (error) {
    ErrorHandler.handleError(error, "run");
    return [];
  }
};
