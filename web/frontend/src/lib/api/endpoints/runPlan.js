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
  const res = await maestroClient.get("/api/run_plans");

  const runPlans = res.data.map(runPlanObjectMapper);

  return runPlans;
};

/**
 *
 * @param {string} runPlanId
 * @returns runPlan object
 */
export const fetchRunPlanById = async (runPlanId) => {
  const res = await maestroClient.get(`/api/run_plan/${runPlanId}`);

  const runPlans = runPlanObjectMapper(res.data);

  return runPlans;
};

/**
 *
 * @param {String} title Title for test plan
 * @param {file} file  test plan Jmeter jmx file
 * @returns {runPlan} test plan object with id
 */
export const createRunPlan = async ({ title, runPlan }) => {
  const formData = new FormData();
  formData.append("run_plan_file", runPlan);
  formData.append("title", title);
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };

  const res = await maestroClient.post(`/api/run_plan`, formData, config);

  const runPlanObject = runPlanObjectMapper(res.data);

  return runPlanObject;
};
