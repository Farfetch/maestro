import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const runConfigurationObjectMapper = (runConfiguration) => ({
  id: runConfiguration.id,
  title: runConfiguration.title,
  labels: runConfiguration.labels,
  customDataIds: runConfiguration.custom_data_ids,
  hosts: runConfiguration.hosts,
  clientAgentId: runConfiguration.client_agent_id,
  serverAgentIds: runConfiguration.server_agent_ids,
  runPlanId: runConfiguration.run_plan_id,
  customProperties: runConfiguration.custom_properties,
  loadProfile: runConfiguration.load_profile,
  createdAt: toLocalDate(runConfiguration.created_at),
  updatedAt: toLocalDate(runConfiguration.updated_at)
});

/**
 *
 * @param {String} runPlanId  ID from RunPlan collection
 * @param {Array} hosts  list of objects: {host: String, ip: String}
 * @param {String} clientAgentId  ID from Agent collection
 * @param {Array} serverAgentIds  List of Ids from Agent collection
 * @param {Array} customDataIds  List of Ids from CustomData collection
 * @param {Array} customProperties  List of properties that would available inside running test
 * @returns
 */
export const createRunConfiguration = async ({
  title,
  labels,
  runPlanId,
  hosts,
  clientAgentId,
  serverAgentIds,
  customDataIds,
  customProperties,
  loadProfile
}) => {
  const res = await maestroClient.post(`/api/run_configuration`, {
    title,
    labels,
    run_plan_id: runPlanId,
    client_agent_id: clientAgentId,
    server_agent_ids: serverAgentIds,
    custom_data_ids: customDataIds,
    custom_properties: customProperties,
    load_profile: loadProfile,
    hosts
  });

  const runConfiguration = runConfigurationObjectMapper(res.data);

  return runConfiguration;
};

/**
 *
 * @param {String} runPlanId  ID from RunPlan collection
 * @param {Array} hosts  list of objects: {host: String, ip: String}
 * @param {String} clientAgentId  ID from Agent collection
 * @param {Array} serverAgentIds  List of Ids from Agent collection
 * @param {Array} customDataIds  List of Ids from CustomData collection
 * @param {Array} customProperties  List of properties that would available inside running test
 * @returns
 */
export const updateRunConfiguration = async (
  runConfigurationId,
  {
    title,
    labels,
    runPlanId,
    hosts,
    clientAgentId,
    serverAgentIds,
    customDataIds,
    customProperties,
    loadProfile
  }
) => {
  const res = await maestroClient.put(
    `/api/run_configuration/${runConfigurationId}`,
    {
      title,
      labels,
      run_plan_id: runPlanId,
      client_agent_id: clientAgentId,
      server_agent_ids: serverAgentIds,
      custom_data_ids: customDataIds,
      custom_properties: customProperties,
      load_profile: loadProfile,
      hosts
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
export const fetchRunConfigurations = async () => {
  const res = await maestroClient.get("/api/run_configurations");

  const runConfigurations = res.data.map(runConfigurationObjectMapper);

  return runConfigurations;
};
