import { Form } from "antd";
import React from "react";

import UploadDragger from "../../../../form/UploadDragger";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const CustomDataFormItem = () => (
  <>
    {/* TODO: add validator to check file extention */}
    <Form.Item label="">
      <Form.Item
        name="customData"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        noStyle
      >
        <UploadDragger
          name="customData"
          multiple={true}
          description="Select list of CSV files to be used in test"
        />
      </Form.Item>
    </Form.Item>
  </>
);

export default CustomDataFormItem;
