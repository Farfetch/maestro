import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import React from "react";

const CreateWorkspaceForm = ({ form, initialValues, onFinish, users }) => {
  const onFinishFailed = async () => {};

  return (
    <Form
      layout="vertical"
      form={form}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
    >
      <Form.Item label="Workspace Name">
        <Form.Item
          name="name"
          noStyle
          rules={[
            {
              required: true,
              message: "Please enter Name"
            }
          ]}
        >
          <Input placeholder="Enter prefered workspace name" />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Users">
        <Form.Item
          name="usersEmail"
          noStyle
          rules={[
            {
              required: true,
              message: "Please select at leat one user"
            }
          ]}
        >
          <Select
            mode="tags"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select or add new users to workspace"
          >
            {users.map((user) => (
              <Select.Option key={user.email}>{user.email}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

CreateWorkspaceForm.propTypes = {
  form: PropTypes.any.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    usersEmail: PropTypes.arrayOf(PropTypes.string)
  }),
  onFinish: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  )
};

export default CreateWorkspaceForm;
