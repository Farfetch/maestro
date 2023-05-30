import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const runConfigurationObjectMapper = (runConfiguration) => ({
  id: runConfiguration.id,
  title: runConfiguration.title,
  labels: runConfiguration.labels,
  customDataIds: runConfiguration.custom_data_ids,
  hosts: runConfiguration.hosts,
  agentIds: runConfiguration.agent_ids,
  runPlanId: runConfiguration.run_plan_id,
  customProperties: runConfiguration.custom_properties,
  loadProfile: runConfiguration.load_profile,
  isLoadProfileEnabled: runConfiguration.is_loadprofile_enabled,
  isScheduleEnabled: runConfiguration.is_schedule_enabled,
  schedule: runConfiguration.schedule,
  createdAt: toLocalDate(runConfiguration.created_at),
  updatedAt: toLocalDate(runConfiguration.updated_at)
});

/**
 *
 * @param {String} runPlanId  ID from RunPlan collection
 * @param {String} workspaceId  Workspace ID
 * @param {Array} hosts  list of objects: {host: String, ip: String}
 * @param {Array} agentIds  List of Ids from Agent collection
 * @param {Array} customDataIds  List of Ids from CustomData collection
 * @param {Array} customProperties  List of properties that would available inside running test
 * @param {Array} loadProfile List of load configuration steps to configure traffic shaping
 * @param {Array} isScheduleEnabled Boolean value to enable/disable scheduling
 * @param {Array} schedule  Object with days and time when to run a test regularly
 * @returns
 */
export const createRunConfiguration = async ({
  title,
  labels,
  runPlanId,
  workspaceId,
  hosts,
  agentIds,
  customDataIds,
  customProperties,
  loadProfile,
  isLoadProfileEnabled,
  isScheduleEnabled,
  schedule
}) => {
  const res = await maestroClient.post(`/api/run_configuration`, {
    title,
    labels,
    run_plan_id: runPlanId,
    workspace_id: workspaceId,
    agent_ids: agentIds,
    custom_data_ids: customDataIds,
    custom_properties: customProperties,
    load_profile: loadProfile,
    is_loadprofile_enabled: isLoadProfileEnabled,
    hosts,
    is_schedule_enabled: isScheduleEnabled,
    ...(schedule ? { schedule } : {})
  });

  const runConfiguration = runConfigurationObjectMapper(res.data);

  return runConfiguration;
};

/**
 *
 * @param {String} runPlanId  ID from RunPlan collection
 * @param {String} workspaceId  Workspace ID
 * @param {Array} hosts  list of objects: {host: String, ip: String}
 * @param {Array} agentIds  List of Ids from Agent collection
 * @param {Array} customDataIds  List of Ids from CustomData collection
 * @param {Array} customProperties  List of properties that would available inside running test
 * @param {Array} loadProfile List of load configuration steps to configure traffic shaping
 * @param {Array} isScheduleEnabled Boolean value to enable/disable scheduling
 * @param {Array} schedule  Object with days and time when to run a test regularly
 * @returns
 */
export const updateRunConfiguration = async (
  runConfigurationId,
  {
    title,
    labels,
    runPlanId,
    workspaceId,
    hosts,
    agentIds,
    customDataIds,
    customProperties,
    loadProfile,
    isLoadProfileEnabled,
    isScheduleEnabled,
    schedule
  }
) => {
  const res = await maestroClient.put(
    `/api/run_configuration/${runConfigurationId}`,
    {
      title,
      labels,
      run_plan_id: runPlanId,
      workspace_id: workspaceId,
      agent_ids: agentIds,
      custom_data_ids: customDataIds,
      custom_properties: customProperties,
      load_profile: loadProfile,
      is_loadprofile_enabled: isLoadProfileEnabled,
      hosts,
      is_schedule_enabled: isScheduleEnabled,
      ...(schedule ? { schedule } : {})
    }
  );

  const runConfiguration = runConfigurationObjectMapper(res.data);

  return runConfiguration;
};

/**
 *
 * @param {string} runConfigurationId
 * @returns {} runConfiguration
 */
export const fetchRunConfigurationById = async (runConfigurationId) => {
  const res = await maestroClient.get(
    `/api/run_configuration/${runConfigurationId}`
  );

  const runConfiguration = runConfigurationObjectMapper(res.data);

  return runConfiguration;
};

/**
 *
 * @returns  [] runConfiguration
 */
export const fetchRunConfigurations = async (filters = {}) => {
  const params = {
    params: {
      ...(filters.workspaceId ? { workspace_id: filters.workspaceId } : {})
    }
  };
  const res = await maestroClient.get("/api/run_configurations", params);

  const runConfigurations = res.data.map(runConfigurationObjectMapper);

  return runConfigurations;
};

/**
 * @param {string} runConfigurationId optional param to update status
 * @returns {RunConfiguration}
 */
export const deleteRunConfiguration = async (runConfigurationId) => {
  const res = await maestroClient.delete(
    `/api/run_configuration/${runConfigurationId}`
  );

  const runConfiguration = runConfigurationObjectMapper(res.data);

  return runConfiguration;
};
