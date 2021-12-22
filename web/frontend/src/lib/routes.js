export const runPlanDownloadUrl = (runPlanId) =>
  `/api/run_plan/${runPlanId}/download`;

export const customDataDownloadUrl = (customDataId) =>
  `/api/custom_data/${customDataId}/download`;

export const testSingleUrl = (runConfigurationId) =>
  `/test/${runConfigurationId}`;

export const testNewUrl = "/tests/new";

export const agentLogsUrl = (runConfigurationId) =>
  `/agent/${runConfigurationId}/logs`;

export const runSingleUrl = (runId) => `/run/${runId}`;
