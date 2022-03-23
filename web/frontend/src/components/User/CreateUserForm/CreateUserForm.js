import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { userRole as userRoleModel } from "../../../lib/api/models";

const CreateUserForm = ({
  form,
  initialValues,
  onFinish,
  workspaces,
  users
}) => {
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
      <Form.Item label="Name">
        <Form.Item
          name="name"
          noStyle
          rules={[
            {
              required: true,
              message: "Please enter User Name"
            }
          ]}
        >
          <Input placeholder="Enter prefered workspace name" />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Email">
        <Form.Item
          name="email"
          noStyle
          rules={[
            {
              required: true,
              message: "Please enter User Email"
            },
            {
              validator: async (rule, value) => {
                // Skip validation when email didn't change
                if (initialValues && initialValues.email === value) return;
                const user = users.find(({ email }) => email === value);
                if (user) {
                  throw new Error("User already exists");
                }
              }
            }
          ]}
        >
          <Input placeholder="Enter prefered workspace name" />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Role">
        <Form.Item
          name="role"
          noStyle
          rules={[
            {
              required: true,
              message: "Please select at leat one user"
            }
          ]}
        >
          <Select
            mode="single"
            style={{ width: "100%" }}
            placeholder="Select User Role"
          >
            <Select.Option key={userRoleModel.USER}>
              {userRoleModel.USER}
            </Select.Option>
            <Select.Option key={userRoleModel.ADMIN}>
              {userRoleModel.ADMIN}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form.Item>
      <Form.Item label="Workspaces">
        <Form.Item
          name="workspaceIds"
          noStyle
          rules={[
            {
              required: true,
              message: "Please select at least one workspace"
            }
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select available workspaces"
          >
            {workspaces.map((workspace) => (
              <Select.Option key={workspace.id}>{workspace.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

CreateUserForm.propTypes = {
  form: PropTypes.any.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    workspaceIds: PropTypes.arrayOf(PropTypes.string)
  }),
  onFinish: PropTypes.func.isRequired,
  workspaces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.oneOf([userRoleModel.USER, userRoleModel.ADMIN]),
      workspaceIds: PropTypes.arrayOf(PropTypes.string),
      createdAt: PropTypes.object.isRequired,
      updatedAt: PropTypes.object.isRequired
    })
  )
};

export default CreateUserForm;
