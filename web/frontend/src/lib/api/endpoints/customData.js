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
export const createCustomData = async ({ name, customData }) => {
  const formData = new FormData();
  formData.append("custom_data_file", customData);
  formData.append("custom_data_name", name);

  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };

  const res = await maestroClient.post(
    `/api/custom_data_from_file`,
    formData,
    config
  );

  const customDataObject = customDataObjectMapper(res.data);
  return customDataObject;
};

export const createCustomData64 = async ({
  name,
  customDataContentType,
  customDataFileBase64
}) => {
  const res = await maestroClient.post(`/api/custom_data_from_base64`, {
    name,
    custom_data_file_content_type: customDataContentType,
    custom_data_file_base64: customDataFileBase64
  });

  const customDataObject = customDataObjectMapper(res.data);
  return customDataObject;
};
