import { Form } from "antd";
import React from "react";

import UploadDragger from "../../../../form/UploadDragger";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const RunPlanFormItem = () => (
  <>
    {/* TODO: add validator to check file extention */}
    <Form.Item label="">
      <Form.Item
        name="runPlans"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        noStyle
        rules={[
          {
            required: true,
            message: "Please input your JMX test file"
          }
        ]}
      >
        <UploadDragger
          name="runPlans"
          multiple={false}
          maxCount={1}
          description="Select your JMeter JMX test plan"
        />
      </Form.Item>
    </Form.Item>
  </>
);

export default RunPlanFormItem;
