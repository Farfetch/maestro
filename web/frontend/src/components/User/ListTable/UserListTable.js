import { Button, Popconfirm, Table, Tag } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

import { deleteUser } from "../../../lib/api/endpoints/user";
import { userRole as userRoleModel } from "../../../lib/api/models";
import EditUserModal from "../EditUserModal";

const userMapper = ({
  id,
  name,
  email,
  role,
  workspaceIds,
  lastLoginAt,
  createdAt,
  updatedAt
}) => ({
  key: id,
  name,
  email,
  role,
  workspaceIds,
  lastLoginAt,
  createdAt,
  updatedAt
});

const UserListTable = ({ workspaces, users, isLoading, refresh }) => {
  const [editUserId, setEditUserId] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filterSearch: true,
      filters: users.map(({ id, name }) => ({
        text: name,
        value: id
      })),
      onFilter: (value, record) => record.key === value,
      render: (text, record) => (
        <>
          {text}{" "}
          {record.role === userRoleModel.ADMIN ? (
            <Tag color="blue">{userRoleModel.ADMIN}</Tag>
          ) : null}
        </>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filterSearch: true,
      filters: users.map(({ id, email }) => ({
        text: email,
        value: id
      })),
      onFilter: (value, record) => record.key === value
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: {
        compare: (recordA, recordB) => recordA.createdAt.diff(recordB.createdAt)
      },
      defaultSortOrder: "descend",
      render: (text, record) => record.createdAt.format("L HH:mm:ss")
    },
    {
      title: "Last Login at",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 180,
      sorter: {
        compare: (recordA, recordB) =>
          recordA.lastLoginAt
            ? recordA.lastLoginAt.diff(recordB.lastLoginAt)
            : -1
      },
      render: (text, record) =>
        record.lastLoginAt ? record.lastLoginAt.format("L HH:mm:ss") : null
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => setEditUserId(record.key)}>
            Edit
          </Button>
          {!record.isDefault ? (
            <Popconfirm
              key="delete"
              placement="left"
              title={
                <>
                  <p>Are you sure you want to delete user?</p>
                  <p>The action is not reversible.</p>
                </>
              }
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                await deleteUser(record.key);
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

  const usersDatasource = users.map(userMapper);

  return (
    <>
      <Table
        size="small"
        isLoading={isLoading}
        dataSource={usersDatasource}
        columns={columns}
        pagination={false}
      />
      {editUserId ? (
        <EditUserModal
          isVisible={!!editUserId}
          initialvalues={users.find(({ id }) => id === editUserId)}
          workspaces={workspaces}
          users={users}
          userId={editUserId}
          onSave={() => {
            setEditUserId(false);
            refresh();
          }}
          onCancel={() => {
            setEditUserId(false);
          }}
        />
      ) : null}
    </>
  );
};

UserListTable.propTypes = {
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

export default UserListTable;
