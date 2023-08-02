import { QuestionCircleOutlined } from "@ant-design/icons";
import { Form, Input, Select, Tooltip } from "antd";
import React from "react";

const TitleFormItem = () => (
  <>
    <Form.Item label="Title">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Form.Item
          name="title"
          noStyle
          rules={[
            {
              required: true,
              message: "Please enter Title"
            }
          ]}
          style={{ flex: 1 }}
        >
          <Input />
        </Form.Item>
        <Tooltip
          title={
            <div>
              You can use tokens in curly braces to dynamically replace them
              with actual values. <br />
              <strong>{"{NUM_AGENTS}"}</strong> returns the number of agents.{" "}
              <br />
              <strong>{"{MAX_RPS}"}</strong> returns the maximum RPS value.{" "}
              <br />
              Any <strong>{"{Custom Property Name}"}</strong> will return the
              custom property value.
            </div>
          }
          placement="topRight"
        >
          <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
        </Tooltip>
      </div>
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
