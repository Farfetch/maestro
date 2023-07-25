import { message } from "antd";

const showError = (content, duration = 5) => {
  message.error({
    content,
    duration,
    key: "errorMessageKey",
    onClick: () => message.destroy("errorMessageKey")
  });
};

export default showError;
