import {
  createCustomData,
  createCustomData64
} from "../../../lib/api/endpoints/customData";
import {
  createRunConfiguration,
  updateRunConfiguration
} from "../../../lib/api/endpoints/runConfiguration";
import {
  createRunPlan,
  createRunPlanBase64
} from "../../../lib/api/endpoints/runPlan";
import { agentStatus as agentStatusModel } from "../../../lib/api/models";

export const uploadCustomData = async (customData) => {
  const customDataIds = await Promise.all(
    customData.map(async (customDataFile) => {
      if (customDataFile.originFileObj) {
        const { id: customDataId } = await createCustomData({
          name: "",
          customData: customDataFile.originFileObj
        });
        return customDataId;
      }

      return customDataFile.uid;
    })
  );
  return customDataIds;
};

export const uploadNewCustomData = async (newCustomData) => {
  const customData = await createCustomData64({
    name: newCustomData.name,
    customDataContentType: newCustomData.custom_data_content_type,
    customDataFileBase64: newCustomData.custom_data_file_base64
  });
  return customData;
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

export const uploadNewRunPlan = async (newRunPlan) => {
  const runPlan = await createRunPlanBase64({
    title: newRunPlan.title,
    runPlanContentType: newRunPlan.run_file_content_type,
    runPlanFileBase64: newRunPlan.run_file_data_base64
  });

  return runPlan;
};

export const saveRunConfiguration = async (runConfigurationId, dataToSave) => {
  if (runConfigurationId === null) {
    const { id: newRunConfigurationId } = await createRunConfiguration(
      dataToSave
    );

    return newRunConfigurationId;
  }
  await updateRunConfiguration(runConfigurationId, dataToSave);
  return runConfigurationId;
};

export const isAgentsStatusValid = (agents, selectedIds) => {
  const availableAgents = agents.filter(
    ({ id, agentStatus }) =>
      selectedIds.includes(id) && agentStatus === agentStatusModel.AVAILABLE
  );

  return selectedIds.length === availableAgents.length;
};
