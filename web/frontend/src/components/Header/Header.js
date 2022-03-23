import "./header.css";

import { Col, Row, Space } from "antd";
import { Link } from "react-router-dom";

import Logo from "../layout/Logo";
import Profile from "./Profile";

const Header = () => (
  <header>
    <Row>
      <Col flex="auto">
        <Space size={24}>
          <Link to="/">
            <Logo />
          </Link>
          <Link to="/history">History</Link>
          <Link to="/tests">Tests</Link>
          <Link to="/agents">Agents</Link>
        </Space>
      </Col>
      <Col style={{ marginLeft: "auto", display: "flex" }}>
        <Profile />
      </Col>
    </Row>
  </header>
);

export default Header;
