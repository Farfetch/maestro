import { Form, message, Modal } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { createUser } from "../../../lib/api/endpoints/user";
import { userRole as userRoleModel } from "../../../lib/api/models";
import CreateUserForm from "../CreateUserForm";

const CreateUserModal = ({
  isVisible,
  onSave,
  onCancel,
  workspaces,
  users
}) => {
  const [form] = Form.useForm();

  const onFinish = async ({ name, email, role, workspaceIds }) => {
    await createUser({ name, email, role, workspaceIds });
    form.resetFields();
    message.success({ content: "Created!", key: "createUser" });
    onSave();
  };

  return (
    <Modal
      title="New User"
      okText="Create"
      visible={isVisible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <CreateUserForm
        form={form}
        users={users}
        initialValues={{}}
        onFinish={onFinish}
        workspaces={workspaces}
      />
    </Modal>
  );
};

CreateUserModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
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

export default CreateUserModal;
