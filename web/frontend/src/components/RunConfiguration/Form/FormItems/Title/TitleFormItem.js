import { Form, Input, Select } from "antd";
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
    <Form.Item label="Labels">
      <Form.Item name="labels" noStyle rules={[]}>
        <Select
          mode="tags"
          allowClear
          style={{ width: "100%" }}
          placeholder="Select default labels"
        />
      </Form.Item>
    </Form.Item>
  </>
);

export default TitleFormItem;
