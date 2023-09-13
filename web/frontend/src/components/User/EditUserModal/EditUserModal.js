import { Form, message, Modal } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { updateUser } from "../../../lib/api/endpoints/user";
import { userRole as userRoleModel } from "../../../lib/api/models";
import CreateUserForm from "../CreateUserForm";

const EditUserModal = ({
  userId,
  initialvalues,
  isVisible,
  onSave,
  onCancel,
  workspaces,
  users
}) => {
  const [form] = Form.useForm();

  const onFinish = async ({ name, email, role, workspaceIds }) => {
    await updateUser(userId, { name, email, role, workspaceIds });
    message.success({ content: "Saved!", key: "editUser" });
    onSave();
  };

  return (
    <Modal
      title="Edit User"
      okText="Save"
      open={isVisible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <CreateUserForm
        form={form}
        users={users}
        initialValues={initialvalues}
        onFinish={onFinish}
        workspaces={workspaces}
      />
    </Modal>
  );
};

EditUserModal.propTypes = {
  workspaceId: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    usersEmail: PropTypes.arrayOf(PropTypes.string)
  }),
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

export default EditUserModal;
