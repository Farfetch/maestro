import { Button, Popconfirm, Table } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

import { deleteWorkspace } from "../../../lib/api/endpoints/workspace";
import { userRole as userRoleModel } from "../../../lib/api/models";
import EditWorkspaceModal from "../EditWorkspaceModal";

const workspaceMapper = ({ id, name, isDefault, createdAt, updatedAt }) => ({
  key: id,
  name,
  isDefault,
  createdAt: createdAt.format("L HH:mm:ss"),
  updatedAt: updatedAt.format("L HH:mm:ss")
});

const WorkspaceListTable = ({ workspaces, users, isLoading, refresh }) => {
  const [editWorkspaceId, setEditWorkspaceId] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => setEditWorkspaceId(record.key)}>
            Edit
          </Button>
          {!record.isDefault ? (
            <Popconfirm
              key="restart"
              placement="left"
              title={
                <>
                  <p>Are you sure you want to delete workspace?</p>
                  <p>
                    All tests, metrics and access to the workspace would be
                    lost.
                  </p>
                </>
              }
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                await deleteWorkspace(record.key);
                refresh();
              }}
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          ) : null}
        </>
      )
    }
  ];

  const workspacesDataSource = workspaces.map(workspaceMapper);

  return (
    <>
      <Table
        size="small"
        isLoading={isLoading}
        dataSource={workspacesDataSource}
        columns={columns}
        pagination={false}
      />
      {editWorkspaceId ? (
        <EditWorkspaceModal
          isVisible={!!editWorkspaceId}
          initialvalues={{
            name: workspaces.find(({ id }) => id === editWorkspaceId).name,
            usersEmail: users
              .filter(({ workspaceIds }) =>
                workspaceIds.includes(editWorkspaceId)
              )
              .map(({ email }) => email)
          }}
          workspaceId={editWorkspaceId}
          users={users}
          onSave={() => {
            setEditWorkspaceId(false);
            refresh();
          }}
          onCancel={() => {
            setEditWorkspaceId(false);
          }}
        />
      ) : null}
    </>
  );
};

WorkspaceListTable.propTypes = {
  workspaces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isDefault: PropTypes.bool.isRequired,
      createdAt: PropTypes.object.isRequired,
      updatedAt: PropTypes.object.isRequired
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
  ),
  isLoading: PropTypes.bool.isRequired
};

export default WorkspaceListTable;
