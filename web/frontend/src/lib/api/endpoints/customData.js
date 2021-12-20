import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const customDataObjectMapper = (customData) => ({
  id: customData.id,
  customDataFile: customData.custom_data_file,
  name: customData.name,
  title: customData.title,
  createdAt: toLocalDate(customData.created_at),
  updatedAt: toLocalDate(customData.updated_at)
});

export const fetchCustomData = async () => {
  const res = await maestroClient.get("/api/custom_data");

  const customData = res.data.map(customDataObjectMapper);

  return customData;
};

export const fetchCustomDataById = async (customDataId) => {
  const res = await maestroClient.get(`/api/custom_data/${customDataId}`);

  return customDataObjectMapper(res.data);
};

/**
 *
 * @param {String} name custom data file name
 * @param {file} customData custom data file object
 */
export const createCustomData = async ({ customData }) => {
  const formData = new FormData();
  formData.append("custom_data_file", customData);

  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };

  const res = await maestroClient.post(`/api/custom_data`, formData, config);

  const runPlanObject = customDataObjectMapper(res.data);

  return runPlanObject;
};
