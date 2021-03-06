import { Table } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { agentStatus as agentStatusModel } from "../../../lib/api/models";
import AgentStatusBadge from "../../badge/AgentStatusBadge";

const columns = [
  {
    title: "Hostname",
    dataIndex: "hostname",
    key: "hostname"
  },
  {
    title: "IP",
    dataIndex: "ip",
    key: "ip",
    width: 180
  },
  {
    title: "Status",
    dataIndex: "agentStatus",
    key: "agentStatus",
    width: 180,
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
    width: 180
  },
  {
    title: "Updated at",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 180
  }
];

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
  createdAt: createdAt.format("L HH:mm:ss"),
  updatedAt: updatedAt.format("L HH:mm:ss")
});

const AgentsListTable = ({ agents, isLoading }) => {
  const agentsDataSource = agents.map(agentMapper);

  return (
    <Table
      size="small"
      isLoading={isLoading}
      dataSource={agentsDataSource}
      columns={columns}
      pagination={false}
    />
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
