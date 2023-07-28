import ErrorHandler from "../../../ErrorHandler";
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
  try {
    const res = await maestroClient.get("/api/custom_data");

    const customData = res.data.map(customDataObjectMapper);

    return customData;
  } catch (error) {
    ErrorHandler.handleError(error, "custom data");
    throw error;
  }
};

export const fetchCustomDataById = async (customDataId) => {
  try {
    const res = await maestroClient.get(`/api/custom_data/${customDataId}`);

    return customDataObjectMapper(res.data);
  } catch (error) {
    ErrorHandler.handleError(error, `custom data with the ID: ${customDataId}`);
    throw error;
  }
};

/**
 *
 * @param {String} name custom data file name
 * @param {file} customData custom data file object
 */
export const createCustomData = async ({ name, customData }) => {
  try {
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
  } catch (error) {
    ErrorHandler.handleError(error, "custom data");
    throw error;
  }
};

export const createCustomData64 = async ({
  name,
  customDataContentType,
  customDataFileBase64
}) => {
  try {
    const res = await maestroClient.post(`/api/custom_data_from_base64`, {
      name,
      custom_data_file_content_type: customDataContentType,
      custom_data_file_base64: customDataFileBase64
    });

    const customDataObject = customDataObjectMapper(res.data);
    return customDataObject;
  } catch (error) {
    ErrorHandler.handleError(error, "custom data");
    throw error;
  }
};
