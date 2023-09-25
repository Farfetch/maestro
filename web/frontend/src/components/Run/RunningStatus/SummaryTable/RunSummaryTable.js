import { LineChartOutlined } from "@ant-design/icons";
import { Button, Table, Typography } from "antd";
import React from "react";

import { avg, calculateErrorRate } from "../../../../lib/utils";

const RunSummaryTable = ({
  metrics,
  isLoading,
  totals,
  setLabelToShowGraph,
  setActiveTabKey
}) => {
  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      width: 300,
      ellipsis: true,
      sorter: {
        compare: (recordA, recordB) => {
          if (recordA.url < recordB.label) {
            return -1;
          }
          if (recordA.label > recordB.label) {
            return 1;
          }
          return 0;
        }
      }
    },
    {
      title: "Latency (p50)",
      dataIndex: "latencyP50",
      key: "latencyP50",
      render: (text, record) => (
        <span key={`${record.url}-latencyP50`}>
          {`${record.latencyP50}`} <span style={{ fontSize: 11 }}>ms</span>
        </span>
      ),
      sorter: {
        compare: (recordA, recordB) => recordA.latencyP50 - recordB.latencyP50
      },
      width: 100
    },
    {
      title: "Latency (p99)",
      dataIndex: "latencyP99",
      key: "latencyP99",
      render: (text, record) => (
        <span key={`${record.url}-latencyP99`}>
          {`${record.latencyP99}`} <span style={{ fontSize: 11 }}>ms</span>
        </span>
      ),
      sorter: {
        compare: (recordA, recordB) => recordA.latencyP99 - recordB.latencyP99
      },
      width: 100
    },
    {
      title: "Total",
      dataIndex: "totalCount",
      key: "totalCount",
      render: (text, record) => (
        <span key={`${record.url}-totalCount`}>{`${record.totalCount}`}</span>
      ),
      sorter: {
        compare: (recordA, recordB) => recordA.totalCount - recordB.totalCount
      },
      width: 100
    },
    {
      title: "Success",
      dataIndex: "successCount",
      key: "successCount",
      render: (text, record) => (
        <span
          key={`${record.url}-successCount`}
        >{`${record.successCount}`}</span>
      ),
      sorter: {
        compare: (recordA, recordB) =>
          recordA.successCount - recordB.successCount
      },
      width: 100
    },
    {
      title: "Error count",
      dataIndex: "errorCount",
      key: "errorCount",
      render: (text, record) => (
        <span key={`${record.url}-error_count`}>{record.errorsCount}</span>
      ),
      sorter: {
        compare: (recordA, recordB) => recordA.errorsCount - recordB.errorsCount
      },
      width: 110
    },
    {
      title: "Error rate",
      dataIndex: "errorRate",
      key: "errorRate",
      defaultSortOrder: "descend",
      render: (text, record) => (
        <span key={`${record.url}-error_rate`}>
          {record.errorRate}
          <span style={{ fontSize: 11 }}>%</span>
        </span>
      ),
      sorter: {
        compare: (recordA, recordB) => recordA.errorRate - recordB.errorRate
      },
      width: 100
    },
    {
      title: "RPM",
      dataIndex: "rpm",
      key: "rpm",
      render: (text, record) => (
        <span key={`${record.url}-rpm`}>
          {record.rpm} <span style={{ fontSize: 11 }}>req/min</span>
        </span>
      ),
      sorter: {
        compare: (recordA, recordB) => recordA.rpm - recordB.rpm
      },
      width: 120
    },
    {
      key: "actions",
      width: 50,
      render: (text, record) => (
        <Button
          icon={<LineChartOutlined />}
          onClick={() => {
            setLabelToShowGraph(record.label);
            setActiveTabKey("endpoints");
          }}
        ></Button>
      )
    }
  ];

  const expandedRowRender = (record) => {
    const expendedRowColumns = [
      {
        title: "Response code",
        dataIndex: "responseCode",
        key: `${record.label}-responseCode-col`
      },
      {
        title: "Messages",
        key: `${record.label}-messages-col`,
        render: (text, { messages }) => (
          <span>
            {messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </span>
        )
      },
      {
        title: "Success",
        dataIndex: "successCount",
        key: `${record.label}-successCount-col`
      },
      {
        title: "Total",
        dataIndex: "totalCount",
        key: `${record.label}-totalCount-col`
      },
      {
        title: "Errors",
        key: `${record.label}-errors-col`,
        render: (text, { successCount, totalCount }) => (
          <span>
            {calculateErrorRate(successCount, totalCount)}{" "}
            <span style={{ fontSize: 11 }}>%</span>
          </span>
        )
      }
    ];

    return (
      <span key={`${record.label}-extended-table`}>
        <Table
          columns={expendedRowColumns}
          dataSource={record.responses}
          pagination={false}
          rowKey="responseCode"
        />
        <Button
          icon={<LineChartOutlined />}
          onClick={() => {
            setLabelToShowGraph(record.label);
            setActiveTabKey("endpoints");
          }}
        ></Button>
      </span>
    );
  };

  return (
    <>
      <Table
        size="small"
        loading={isLoading}
        dataSource={metrics}
        columns={columns}
        pagination={false}
        expandable={{
          expandedRowRender
        }}
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell />
              <Table.Summary.Cell>
                <Typography.Text strong>Total</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>
                  <Typography.Text strong>
                    {avg(totals.totalLatencyP50, metrics.length).toFixed(2)}
                  </Typography.Text>
                  <span style={{ fontSize: 11 }}> ms</span>
                </Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>
                  <Typography.Text strong>
                    {avg(totals.totalLatencyP99, metrics.length).toFixed(2)}
                  </Typography.Text>
                  <span style={{ fontSize: 11 }}> ms</span>
                </Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>{totals.totalCount}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>
                  {totals.totalSuccessCount}
                </Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>
                  {totals.totalErrorsCount}
                </Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>
                  {parseFloat(totals.totalErrorsRate)}
                </Typography.Text>
                <span style={{ fontSize: 11 }}> %</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>
                  {avg(totals.totalRpm, metrics.length).toFixed(0)}
                </Typography.Text>
                <span style={{ fontSize: 11 }}> req/min</span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </>
  );
};

export default RunSummaryTable;
