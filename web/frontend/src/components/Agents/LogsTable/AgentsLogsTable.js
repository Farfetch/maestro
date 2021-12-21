import { Table } from "antd";
import PropTypes from "prop-types";

import { agentLogLevel as agentLogLevelModel } from "../../../lib/api/models";

const columns = [
  {
    title: "Datetime",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 180
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    width: 80
  },
  {
    title: "Log message",
    dataIndex: "logMessage",
    key: "logMessage"
  },
  {
    title: "Host",
    dataIndex: "hostname",
    key: "hostname",
    width: 180
  }
];

const agentLogsMapper = ({
  id,
  level,
  hostname,
  logMessage,
  createdAt,
  updatedAt
}) => ({
  key: id,
  level,
  hostname,
  logMessage,
  createdAt: createdAt.format("L HH:mm:ss"),
  updatedAt: updatedAt.format("L HH:mm:ss")
});

const AgentsLogsTable = ({ agentLogs, isLoading }) => {
  const agentLogsDataSource = agentLogs.map(agentLogsMapper);

  return (
    <Table
      size="small"
      loading={isLoading}
      dataSource={agentLogsDataSource}
      columns={columns}
      pagination={{
        defaultPageSize: 200,
        hideOnSinglePage: true,
        pageSizeOptions: [50, 100, 200, 1000],
        position: ["bottomRight"]
      }}
    />
  );
};

AgentsLogsTable.propTypes = {
  runConfigurations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      level: PropTypes.oneOf(Object.values(agentLogLevelModel)).isRequired,
      logMessage: PropTypes.string.isRequired,
      hostname: PropTypes.string.isRequired,
      createdAt: PropTypes.object.isRequired,
      updatedAt: PropTypes.object.isRequired
    })
  ),
  isLoading: PropTypes.bool.isRequired
};

export default AgentsLogsTable;
