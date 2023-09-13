import { Form, message, Modal } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { createWorkspace } from "../../../lib/api/endpoints/workspace";
import CreateWorkspaceForm from "../CreateWorkspaceForm";

const CreateWorkspaceModal = ({ isVisible, onSave, onCancel, users }) => {
  const [form] = Form.useForm();

  const onFinish = async ({ name, usersEmail }) => {
    await createWorkspace({ name, usersEmail });
    form.resetFields();
    message.success({ content: "Created!", key: "createWorkspace" });
    onSave();
  };

  return (
    <Modal
      title="New Workspace"
      okText="Create"
      open={isVisible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <CreateWorkspaceForm
        form={form}
        initialValues={{}}
        onFinish={onFinish}
        users={users}
      />
    </Modal>
  );
};

CreateWorkspaceModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  )
};

export default CreateWorkspaceModal;
