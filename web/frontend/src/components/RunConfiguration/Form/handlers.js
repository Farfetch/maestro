import { createCustomData } from "../../../lib/api/endpoints/customData";
import {
  createRunConfiguration,
  updateRunConfiguration
} from "../../../lib/api/endpoints/runConfiguration";
import { createRunPlan } from "../../../lib/api/endpoints/runPlan";

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
