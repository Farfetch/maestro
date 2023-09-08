import { message } from "antd";
import axios from "axios";

import showError from "./components/CustomErrorMessage";

class ErrorHandler {
  static setup() {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  static showError = (content, duration = 0) => {
    message.error({
      content,
      duration,
      key: "errorMessageKey",
      onClick: () => message.destroy("errorMessageKey")
    });
  };

  static handleError(error, endpoint) {
    if (axios.isAxiosError(error)) {
      const { status, statusText, data, code } = error.response || error;

      if (status) {
        const errorMessage = this.getHttpErrorMessage(
          status,
          statusText,
          data,
          endpoint
        );
        showError(errorMessage, 0);
      } else if (code === "ECONNABORTED") {
        showError(
          "Connection Timeout: The request took too long to complete. Please try again.",
          5
        );
      } else {
        showError("An unexpected error occurred. Please try again later.", 5);
      }
    } else {
      // eslint-disable-next-line no-console
      showError(error.message);
    }
  }

  // eslint-disable-next-line max-statements
  static getHttpErrorMessage(status, statusText, data, endpoint) {
    let errorMessage = `Unexpected behavior\nError: ${status} - ${statusText}\n`;

    if (status === 400) {
      errorMessage += "Request not correct.";
    } else if (status === 401) {
      errorMessage += "Unauthorized. Please log in.";
    } else if (status === 403) {
      errorMessage += "You do not have access rights to this resource.";
    } else if (status === 404) {
      errorMessage += `The ${endpoint} endpoint was not found.`;
    } else if (status === 429) {
      errorMessage += "Please wait and try again.";
    } else if (status >= 500) {
      errorMessage = `Unexpected behavior, please contact the administrator.\nError: ${status} - ${statusText}\n`;
    }

    if (data && data.error) {
      errorMessage += ` Additional message: ${data.error}`;
    }

    return errorMessage;
  }
}

export default ErrorHandler;
