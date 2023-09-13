import { Form, message, Modal } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { updateWorkspace } from "../../../lib/api/endpoints/workspace";
import CreateWorkspaceForm from "../CreateWorkspaceForm";

const EditWorkspaceModal = ({
  workspaceId,
  initialvalues,
  isVisible,
  onSave,
  onCancel,
  users
}) => {
  const [form] = Form.useForm();

  const onFinish = async ({ name, usersEmail }) => {
    await updateWorkspace(workspaceId, { name, usersEmail });
    message.success({ content: "Saved!", key: "editWorkspace" });
    onSave();
  };

  return (
    <Modal
      title="Edit Workspace"
      okText="Save"
      open={isVisible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <CreateWorkspaceForm
        form={form}
        initialValues={initialvalues}
        onFinish={onFinish}
        users={users}
      />
    </Modal>
  );
};

EditWorkspaceModal.propTypes = {
  workspaceId: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    usersEmail: PropTypes.arrayOf(PropTypes.string)
  }),
  isVisible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  )
};

export default EditWorkspaceModal;
