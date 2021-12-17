import { Col, Row, Space, Table } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: {
      compare: (recordA, recordB) => recordA.createdAt.diff(recordB.createdAt),
      multiple: 1
    },
    render: (text, record) => record.createdAt.format("L HH:mm:ss"),
    defaultSortOrder: "descend",
    width: 180
  },
  {
    title: "Updated",
    dataIndex: "updatedAt",
    key: "updatedAt",
    sorter: {
      compare: (recordA, recordB) => recordA.updatedAt.diff(recordB.updatedAt),
      multiple: 1
    },
    render: (text, record) => record.updatedAt.format("L HH:mm:ss"),
    width: 180
  },
  {
    title: "Action",
    key: "action",
    width: 200,
    render: (text, record) => (
      <>
        <Space size="middle">
          <Link to={`/test/${record.key}`}>Open</Link>
        </Space>
      </>
    )
  }
];

const runConfigurationMapper = ({
  id,
  title,
  runPlanId,
  createdAt,
  updatedAt
}) => ({
  key: id,
  title,
  runPlanId,
  createdAt,
  updatedAt
});

const RunConfigurationsTable = ({ runConfigurations, isLoading = false }) => {
  const dataSource = runConfigurations.map(runConfigurationMapper);
  const pagination = {
    defaultPageSize: 50,
    hideOnSinglePage: true,
    pageSizeOptions: [50, 100, 200, 1000],
    position: ["bottomRight"]
  };

  return (
    <Row gutter={[32, 32]} justify="start" align="middle">
      <Col span={24}>
        <Table
          size="small"
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
        />
      </Col>
    </Row>
  );
};

RunConfigurationsTable.propTypes = {
  runConfigurations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      runPlanId: PropTypes.string.isRequired,
      createdAt: PropTypes.object.isRequired,
      updatedAt: PropTypes.object.isRequired
    })
  ),
  isLoading: PropTypes.bool.isRequired
};

export default RunConfigurationsTable;
