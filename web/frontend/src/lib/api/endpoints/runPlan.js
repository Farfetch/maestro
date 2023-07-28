import ErrorHandler from "../../../ErrorHandler";
import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const runPlanObjectMapper = (runPlan) => ({
  id: runPlan.id,
  runPlanFile: runPlan.run_plan_file,
  title: runPlan.title,
  createdAt: toLocalDate(runPlan.created_at),
  updatedAt: toLocalDate(runPlan.updated_at)
});

export const fetchRunPlans = async () => {
  try {
    const res = await maestroClient.get("/api/run_plans");

    const runPlans = res.data.map(runPlanObjectMapper);

    return runPlans;
  } catch (error) {
    ErrorHandler.handleError(error, "run plans");
    throw error;
  }
};

/**
 *
 * @param {string} runPlanId
 * @returns runPlan object
 */
export const fetchRunPlanById = async (runPlanId) => {
  try {
    const res = await maestroClient.get(`/api/run_plan/${runPlanId}`);

    const runPlans = runPlanObjectMapper(res.data);

    return runPlans;
  } catch (error) {
    ErrorHandler.handleError(error, `run plan with ID: ${runPlanId}`);
    throw error;
  }
};

/**
 *
 * @param {String} title Title for test plan
 * @param {file} file  test plan Jmeter jmx file
 * @returns {runPlan} test plan object with id
 */
export const createRunPlan = async ({ title, runPlan }) => {
  try {
    const formData = new FormData();
    formData.append("run_plan_file", runPlan);
    formData.append("title", title);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    const res = await maestroClient.post(
      `/api/run_plan_from_file`,
      formData,
      config
    );

    const runPlanObject = runPlanObjectMapper(res.data);

    return runPlanObject;
  } catch (error) {
    ErrorHandler.handleError(error, "run plan");
    throw error;
  }
};

export const createRunPlanBase64 = async ({
  title,
  runPlanContentType,
  runPlanFileBase64
}) => {
  try {
    const res = await maestroClient.post(`/api/run_plan_from_base64`, {
      title,
      run_plan_file_content_type: runPlanContentType,
      run_plan_file_base64: runPlanFileBase64
    });

    const runPlanObject = runPlanObjectMapper(res.data);
    return runPlanObject;
  } catch (error) {
    ErrorHandler.handleError(error, "run plan");
    throw error;
  }
};
