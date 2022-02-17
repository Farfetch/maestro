import { createCustomData } from "../../../lib/api/endpoints/customData";
import {
  createRunConfiguration,
  updateRunConfiguration
} from "../../../lib/api/endpoints/runConfiguration";
import { createRunPlan } from "../../../lib/api/endpoints/runPlan";
import { agentStatus as agentStatusModel } from "../../../lib/api/models";

export const uploadCustomData = async (customData) => {
  const customDataIds = await Promise.all(
    customData.map(async (customDataFile) => {
      if (customDataFile.originFileObj) {
        const { id: customDataId } = await createCustomData({
          customData: customDataFile.originFileObj
        });
        return customDataId;
      }

      return customDataFile.uid;
    })
  );
  return customDataIds;
};

export const uploadRunPlan = async (runPlan) => {
  if (runPlan.originFileObj) {
    const { id: runPlanId } = await createRunPlan({
      title: runPlan.name,
      runPlan: runPlan.originFileObj
    });

    return runPlanId;
  }

  return runPlan.uid;
};

export const saveRunConfiguration = async (
  runConfigurationId,
  {
    title,
    labels,
    runPlanId,
    clientAgentId,
    serverAgentIds,
    hosts,
    customDataIds,
    customProperties,
    loadProfile
  }
) => {
  if (runConfigurationId === null) {
    const { id: newRunConfigurationId } = await createRunConfiguration({
      title,
      labels,
      runPlanId,
      clientAgentId,
      serverAgentIds,
      hosts,
      customDataIds,
      customProperties,
      loadProfile
    });

    return newRunConfigurationId;
  }
  await updateRunConfiguration(runConfigurationId, {
    title,
    labels,
    runPlanId,
    clientAgentId,
    serverAgentIds,
    hosts,
    customDataIds,
    customProperties,
    loadProfile
  });
  return runConfigurationId;
};

export const isAgentsStatusValid = (agents, selectedIds) => {
  const availableAgents = agents.filter(
    ({ id, agentStatus }) =>
      selectedIds.includes(id) && agentStatus === agentStatusModel.AVAILABLE
  );

  return selectedIds.length === availableAgents.length;
};
