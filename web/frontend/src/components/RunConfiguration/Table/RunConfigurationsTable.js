import { FolderOpenOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Table } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

import { daysOfTheWeek, toLocalHourMinute } from "../../../lib/date";
import { testSingleUrl } from "../../../lib/routes";
import RunConfigurationDeleteButton from "./DeleteButton";

const getColumns = (refetch) => [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: 400,
    ellipsis: true
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
    width: 80
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
        <Space size="small">
          <Link to={testSingleUrl(record.key)}>
            <Button type="link" icon={<FolderOpenOutlined />}>
              Open
            </Button>
          </Link>
          <RunConfigurationDeleteButton
            runConfigurationId={record.key}
            refetch={refetch}
          />
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

const RunConfigurationsTable = ({
  runConfigurations,
  refetch,
  isLoading = false
}) => {
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
          columns={getColumns(refetch)}
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
  refetch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default RunConfigurationsTable;
