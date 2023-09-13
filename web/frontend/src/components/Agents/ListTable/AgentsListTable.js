import { DisconnectOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Space, Switch, Table } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { updateAgent } from "../../../lib/api/endpoints/agent";
import { agentStatus as agentStatusModel } from "../../../lib/api/models";
import { agentLogsUrl } from "../../../lib/routes";
import AgentStatusBadge from "../../badge/AgentStatusBadge";

const agentMapper = ({
  id,
  agentStatus,
  hostname,
  ip,
  createdAt,
  updatedAt
}) => ({
  key: id,
  agentStatus,
  hostname,
  ip,
  createdAt,
  updatedAt
});

const AgentsListTable = ({ agents, isLoading, updateTestPlans }) => {
  const [showDisabledAgents, setShowDisabledAgents] = useState(false);
  const agentsDataSource = agents
    .map(agentMapper)
    .filter((agent) => showDisabledAgents || agent.agentStatus !== "DISABLED");

  const disableAgent = async (agentId) => {
    await updateAgent(agentId, {
      agent_status: "DISABLED"
    });
    message.success({ content: "Agent Disabled", duration: 5 });
    updateTestPlans();
  };

  const columns = [
    {
      title: "Hostname",
      dataIndex: "hostname",
      key: "hostname",
      width: 400,
      ellipsis: true,
      sorter: {
        compare: (recordA, recordB) =>
          recordB.hostname.localeCompare(recordA.hostname)
      },
      defaultSortOrder: "descend"
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      width: 150
    },
    {
      title: "Status",
      dataIndex: "agentStatus",
      key: "agentStatus",
      width: 180,
      filters: Object.values(agentStatusModel).map((agentStatus) => ({
        text: agentStatus,
        value: agentStatus
      })),
      filterSearch: true,
      onFilter: (value, record) => record.agentStatus === value,
      render: (text, record) => (
        <AgentStatusBadge
          agentStatus={record.agentStatus}
          text={record.agentStatus}
        />
      )
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: {
        compare: (recordA, recordB) => recordB.createdAt.diff(recordA.createdAt)
      },
      render: (text, record) => record.createdAt.format("L HH:mm:ss")
    },
    {
      title: "Updated at",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      sorter: {
        compare: (recordA, recordB) => recordB.updatedAt.diff(recordA.updatedAt)
      },
      render: (text, record) => record.updatedAt.format("L HH:mm:ss")
    },
    {
      key: "action",
      width: 100,
      render: (text, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<DisconnectOutlined />}
            onClick={() => {
              disableAgent(record.key);
            }}
            disabled={
              record.agentStatus === "DISABLED" ||
              record.agentStatus === "AVAILABLE" ||
              record.agentStatus === "RUNNING_TEST"
            }
          >
            Disable
          </Button>
          <Link to={agentLogsUrl(record.key)}>
            <Button icon={<FileTextOutlined />}></Button>
          </Link>{" "}
        </Space>
      )
    }
  ];

  const handleDisabledAgents = (value) => {
    setShowDisabledAgents(value);
  };

  return (
    <Row justify="end" align="middle">
      <Col
        span={12}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "10px"
        }}
      >
        <span>Show Disabled Agents</span>
        <Switch
          onChange={(value) => {
            handleDisabledAgents(value);
          }}
          style={{ marginLeft: 8 }}
        />
      </Col>
      <Col span={24}>
        <Table
          size="small"
          isLoading={isLoading}
          dataSource={agentsDataSource}
          columns={columns}
          pagination={false}
        />
      </Col>
    </Row>
  );
};

AgentsListTable.propTypes = {
  runConfigurations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      agentStatus: PropTypes.oneOf(Object.values(agentStatusModel)).isRequired,
      hostname: PropTypes.string.isRequired,
      ip: PropTypes.string.isRequired,
      createdAt: PropTypes.object.isRequired,
      updatedAt: PropTypes.object.isRequired
    })
  ),
  isLoading: PropTypes.bool.isRequired
};

export default AgentsListTable;
