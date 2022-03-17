import { Col, Row, Space, Table } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

import { daysOfTheWeek, toLocalHourMinute } from "../../../lib/date";
import { testSingleUrl } from "../../../lib/routes";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Next Run",
    dataIndex: "nextRun",
    key: "nextRun",
    sorter: {
      compare: (recordA, recordB) => recordA.nextRun.diff(recordB.nextRun),
      multiple: 1
    },
    render: (text, record) =>
      record.nextRun ? record.nextRun.format("L HH:mm") : null,
    width: 180
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: {
      compare: (recordA, recordB) => recordA.createdAt.diff(recordB.createdAt),
      multiple: 1
    },
    render: (text, record) => record.createdAt.format("L HH:mm"),
    defaultSortOrder: "descend",
    width: 180
  },

  {
    title: "Action",
    key: "action",
    width: 200,
    render: (text, record) => (
      <>
        <Space size="middle">
          <Link to={testSingleUrl(record.key)}>Open</Link>
        </Space>
      </>
    )
  }
];

const findNextRun = (schedule) => {
  if (!schedule) return false;

  let isDayAvailable = false;
  const nextRunningDate = toLocalHourMinute(schedule.time);
  const now = moment().local();
  while (isDayAvailable === false) {
    const dayToLook = daysOfTheWeek[nextRunningDate.day()];

    isDayAvailable = schedule.days.includes(dayToLook) && nextRunningDate > now;

    if (!isDayAvailable) {
      nextRunningDate.add(1, "days");
    }
  }

  return nextRunningDate;
};

const runConfigurationMapper = ({
  id,
  title,
  runPlanId,
  createdAt,
  schedule
}) => ({
  key: id,
  title,
  runPlanId,
  nextRun: findNextRun(schedule),
  schedule,
  createdAt
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
