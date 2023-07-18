import "./header.css";

import { Col, Descriptions, Row, Space, Tooltip, Typography } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { RunningContext } from "../../context/Running/RunningContext";
import Logo from "../layout/Logo";
import Profile from "./Profile";

const { Text } = Typography;

const Header = () => {
  const { runs } = useContext(RunningContext);

  const activeRunNames = runs ? runs.map((run) => run.title) : [];

  return (
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
        <Col style={{ display: "flex", alignItems: "center" }}>
          {runs && runs.length > 0 && (
            <Tooltip
              title={
                <div>
                  {activeRunNames.map((name, index) => (
                    <div key={index}>{name}</div>
                  ))}
                </div>
              }
              placement="bottom"
              trigger="hover"
            >
              <Link to="/">
                <div
                  style={{
                    paddingTop: "5px",
                    marginRight: "15px",
                    cursor: "pointer",
                    display: "inline-block"
                  }}
                >
                  <Descriptions
                    size="small"
                    bordered
                    labelStyle={{
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                      borderColor: "#d6d6d6",
                      background: "white"
                    }}
                    contentStyle={{
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                      background: "#d9f7be"
                    }}
                  >
                    <Descriptions.Item label="Active Runs">
                      <Text strong>{runs.length}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Link>
            </Tooltip>
          )}
          <Profile />
        </Col>
      </Row>
    </header>
  );
};

export default Header;
