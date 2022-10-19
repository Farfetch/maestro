import { Table } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { agentStatus as agentStatusModel } from "../../../lib/api/models";
import AgentStatusBadge from "../../badge/AgentStatusBadge";

const columns = [
  {
    title: "Hostname",
    dataIndex: "hostname",
    key: "hostname",
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
    width: 180
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
  createdAt,
  updatedAt
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
