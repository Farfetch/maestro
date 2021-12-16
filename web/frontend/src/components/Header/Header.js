import "./header.css";

import { Col, Row, Space } from "antd";
import { Link } from "react-router-dom";

import Logo from "../layout/Logo";

const Header = () => (
  <header>
    <Row>
      <Col span={24}>
        <Space size={24} align="center">
          <Link to="/">
            <Logo />
          </Link>
          <Link to="/history">History</Link>
          <Link to="/tests">Tests</Link>
          <Link to="/agents">Agents</Link>
        </Space>
      </Col>
    </Row>
  </header>
);

export default Header;
