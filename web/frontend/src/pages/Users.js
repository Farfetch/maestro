import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import PageTitle from "../components/layout/PageTitle";
import CreateUserModal from "../components/User/CreateUserModal";
import UserListTable from "../components/User/ListTable";
import { fetchUsers } from "../lib/api/endpoints/user";
import { fetchWorkspaces } from "../lib/api/endpoints/workspace";

const UsersPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateUserVisible, setIsCreateUserVisibile] = useState(false);

  const updateWorkspacesAndUsers = async () => {
    setIsLoading(true);

    const [workspacesRes, usersRes] = await Promise.all([
      fetchWorkspaces(),
      fetchUsers()
    ]);

    setWorkspaces(workspacesRes);
    setUsers(usersRes);

    setIsLoading(false);
  };

  useEffect(() => {
    updateWorkspacesAndUsers();
  }, []);

  return (
    <>
      <PageTitle
        title={"Users"}
        button={
          <Button
            type="primary"
            size="large"
            onClick={() => setIsCreateUserVisibile(true)}
          >
            Create
          </Button>
        }
      />
      <Row gutter={[32, 32]} justify="start" align="middle">
        <Col span={24}>
          <UserListTable
            isLoading={isLoading}
            workspaces={workspaces}
            users={users}
            refresh={updateWorkspacesAndUsers}
          />
        </Col>
      </Row>
      <CreateUserModal
        users={users}
        workspaces={workspaces}
        isVisible={isCreateUserVisible}
        onSave={() => {
          setIsCreateUserVisibile(false);
          updateWorkspacesAndUsers();
        }}
        onCancel={() => {
          setIsCreateUserVisibile(false);
        }}
      />
    </>
  );
};

export default UsersPage;
