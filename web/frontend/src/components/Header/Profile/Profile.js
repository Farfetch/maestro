import {
  AppstoreOutlined,
  DownOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Dropdown, Menu, Space, Typography } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../../context/User";
import { logoutUrl, usersUrl, workspacesUrl } from "../../../lib/routes";
import Avatar from "../../layout/Avatar";

const Profile = () => {
  const { user } = useContext(UserContext);

  const menu = (
    <Menu>
      <Menu.Item key="workspaces" icon={<AppstoreOutlined />}>
        <Link to={workspacesUrl}>Workspaces</Link>
      </Menu.Item>
      <Menu.Item key="users" icon={<UserOutlined />}>
        <Link to={usersUrl}>Users</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <a href={logoutUrl}>Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Space align="center" size={12} style={{ height: "54px" }}>
      <Avatar user={user} />
      <Dropdown overlay={menu}>
        <Typography.Text style={{ cursor: "pointer" }}>
          {user.email} <DownOutlined />
        </Typography.Text>
      </Dropdown>
    </Space>
  );
};

export default Profile;
