import {
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Dropdown, Menu, Select, Space } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { CurrentWorkspaceContext } from "../../../context/CurrentWorkspace";
import { UserContext } from "../../../context/User";
import { userRole as userRoleModel } from "../../../lib/api/models";
import { logoutUrl, usersUrl, workspacesUrl } from "../../../lib/routes";
import Avatar from "../../layout/Avatar";

const Profile = () => {
  const { user, workspaces } = useContext(UserContext);
  const { currentWorkspace, setCurrentWorkspace } = useContext(
    CurrentWorkspaceContext
  );

  const menu = (
    <Menu>
      <Menu.Item key="me" disabled>
        {user.email}
      </Menu.Item>
      {user.role === userRoleModel.ADMIN ? (
        <>
          <Menu.Item key="workspaces" icon={<AppstoreOutlined />}>
            <Link to={workspacesUrl}>Workspaces</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to={usersUrl}>Users</Link>
          </Menu.Item>
        </>
      ) : null}
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <a href={logoutUrl}>Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Space align="center">
      <Select
        style={{ width: 240 }}
        onChange={(workspaceId) => setCurrentWorkspace(workspaceId)}
        defaultValue={currentWorkspace.id}
      >
        {workspaces.map((workspace) => (
          <Select.Option value={workspace.id} key={workspace.id}>
            {workspace.name}
          </Select.Option>
        ))}
      </Select>
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <div style={{ cursor: "pointer" }}>
          <Avatar user={user} />
        </div>
      </Dropdown>
    </Space>
  );
};

export default Profile;
