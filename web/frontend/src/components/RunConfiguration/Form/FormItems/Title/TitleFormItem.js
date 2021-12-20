import { Form, Input } from "antd";
import React from "react";

const TitleFormItem = () => (
  <>
    <Form.Item label="Title">
      <Form.Item
        name="title"
        noStyle
        rules={[
          {
            required: true,
            message: "Please enter Title"
          }
        ]}
      >
        <Input />
      </Form.Item>
    </Form.Item>
  </>
);

export default TitleFormItem;
