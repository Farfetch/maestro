import { maestroApiUrl } from "../config";

export const runPlanDownloadUrl = (runPlanId) =>
  `${maestroApiUrl}/api/run_plan/${runPlanId}/download`;

export const customDataDownloadUrl = (customDataId) =>
  `${maestroApiUrl}/api/custom_data/${customDataId}/download`;

export const runMetricsDownloadUrl = (runId) =>
  `${maestroApiUrl}/api/run_metrics/${runId}/download`;

export const runLogDownloadUrl = (runId) =>
  `${maestroApiUrl}/api/run_log/${runId}/download`;

export const RunConfigurationDownloadUrl = (runConfigurationId) =>
  `${maestroApiUrl}/api/run_configuration/${runConfigurationId}/download`;

export const testSingleUrl = (runConfigurationId) =>
  `/test/${runConfigurationId}`;

export const testNewUrl = "/tests/new";

export const agentLogsUrl = (runConfigurationId) =>
  `/agent/${runConfigurationId}/logs`;

export const runSingleUrl = (runId) => `/run/${runId}`;

export const homeUrl = "/";

export const testsUrl = "/tests";

export const historyUrl = "/history";

export const runsHistory = (runConfigurationId) =>
  `/history/${runConfigurationId}`;

export const logoutUrl = `${maestroApiUrl}/logout`;

export const workspacesUrl = "/workspaces";

export const usersUrl = "/users";
