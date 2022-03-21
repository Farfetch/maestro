import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import PageTitle from "../components/layout/PageTitle";
import CreateWorkspaceModal from "../components/Workspace/CreateWorkspaceModal";
import WorkspaceLisTable from "../components/Workspace/ListTable";
import { fetchUsers } from "../lib/api/endpoints/user";
import { fetchWorkspaces } from "../lib/api/endpoints/workspace";

const WorkspacesPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateWorkspaceVisible, setIsCreateWorkspaceVisible] =
    useState(false);

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
        title={"Workspaces"}
        button={
          <Button
            type="primary"
            size="large"
            onClick={() => setIsCreateWorkspaceVisible(true)}
          >
            Create
          </Button>
        }
      />
      <Row gutter={[32, 32]} justify="start" align="middle">
        <Col span={24}>
          <WorkspaceLisTable
            isLoading={isLoading}
            workspaces={workspaces}
            users={users}
            refresh={updateWorkspacesAndUsers}
          />
        </Col>
      </Row>
      <CreateWorkspaceModal
        users={users}
        isVisible={isCreateWorkspaceVisible}
        onSave={() => {
          setIsCreateWorkspaceVisible(false);
          updateWorkspacesAndUsers();
        }}
        onCancel={() => {
          setIsCreateWorkspaceVisible(false);
        }}
      />
    </>
  );
};

export default WorkspacesPage;
