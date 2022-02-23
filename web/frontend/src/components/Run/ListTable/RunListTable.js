import { Col, Row, Space, Table, Tag } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { runStatus as runStatusModel } from "../../../lib/api/models";
import { runSingleUrl } from "../../../lib/routes";
import RunStatusTag from "../../tag/RunStatusTag";

const getColumns = (labels) => [
  {
    title: "Title",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes"
  },
  {
    title: "Labels",
    dataIndex: "labels",
    key: "labels",
    width: 180,
    filters: labels.map((label) => ({
      text: label,
      value: label
    })),
    filterSearch: true,
    onFilter: (value, record) => record.labels.includes(value),
    render: (text, record) =>
      record.labels.map((label) => <Tag key={record.key + label}>{label}</Tag>)
  },
  {
    title: "Status",
    dataIndex: "runStatus",
    key: "runStatus",
    width: 100,
    filters: Object.values(runStatusModel).map((runStatus) => ({
      text: runStatus,
      value: runStatus
    })),
    onFilter: (value, record) => record.runStatus === value,
    render: (text) => <RunStatusTag runStatus={text} />
  },
  {
    title: "Started at",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: {
      compare: (recordA, recordB) => recordA.createdAt.diff(recordB.createdAt),
      multiple: 1
    },
    defaultSortOrder: "descend",
    render: (text, record) => record.createdAt.format("L HH:mm:ss"),
    width: 180
  },
  {
    title: "Action",
    key: "action",
    width: 80,
    render: (text, record) => (
      <Space size="middle">
        <Link to={runSingleUrl(record.key)}>Open</Link>
        {/* TODO: add delete to remove all data that is related to the test run */}
      </Space>
    )
  }
];

const runMapper = ({ id, title, runStatus, notes, labels, createdAt }) => ({
  key: id,
  title,
  runStatus,
  notes,
  labels,
  createdAt
});

const RunListTable = ({ runs, isLoading }) => {
  const runsDataSource = runs.map(runMapper);
  const labels = runs.reduce((previousValue, run) => {
    run.labels.forEach((label) => {
      if (!previousValue.includes(label)) {
        previousValue.push(label);
      }
    });

    return previousValue;
  }, []);

  return (
    <Row gutter={[32, 32]} justify="start" align="middle">
      <Col span={24}>
        <Table
          size="small"
          loading={isLoading}
          dataSource={runsDataSource}
          columns={getColumns(labels)}
          pagination={{
            defaultPageSize: 50,
            hideOnSinglePage: true,
            pageSizeOptions: [50, 100, 200, 1000],
            position: ["bottomRight"]
          }}
        />
      </Col>
    </Row>
  );
};

RunListTable.propTypes = {
  runs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      runStatus: PropTypes.string.isRequired,
      createdAt: PropTypes.object.isRequired,
      updatedAt: PropTypes.object.isRequired
    })
  ),
  isLoading: PropTypes.bool.isRequired
};

export default RunListTable;
