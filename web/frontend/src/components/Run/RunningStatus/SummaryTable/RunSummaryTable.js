import { LineChartOutlined } from "@ant-design/icons";
import { Button, Table, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";
import { avg } from "../../../../lib/utils";

const RunSummaryTable = ({ runId, setLabelToShowGraph, setActiveTabKey }) => {
  const [urlMetrics, setUrlMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateErrorRate = (successCount, totalCount) => {
    const errorRate = parseFloat((1 - successCount / totalCount) * 100).toFixed(
      2
    );

    return errorRate;
  };

  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      className: "truncate-column",
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

  const updateUrlMetrics = async (runIdToFetch) => {
    setIsLoading(true);

    const metricsRes = await fetchMetrics(runIdToFetch, 0, true);

    const getRpm = (minDatetime, maxDatetime, totalCount) => {
      const dateDuration = moment.duration(maxDatetime.diff(minDatetime));
      const diffInSeconds =
        dateDuration.asSeconds() > 0 ? dateDuration.asSeconds() : 1;

      return parseFloat((totalCount / diffInSeconds) * 60).toFixed(0);
    };

    const formattedUrlMetrics = metricsRes.map(
      ({
        minDatetime,
        maxDatetime,
        totalCount,
        successCount,
        label,
        latencyAvg,
        latencyP50,
        latencyP99,
        responses
      }) => {
        const errorsCount = totalCount - successCount;
        const errorRate = calculateErrorRate(successCount, totalCount);
        const rpm = getRpm(minDatetime, maxDatetime, totalCount);

        return {
          key: label,
          errorsCount,
          successCount,
          errorRate,
          label,
          rpm,
          totalCount,
          latencyAvg,
          latencyP50,
          latencyP99,
          responses
        };
      }
    );

    setUrlMetrics(formattedUrlMetrics);

    setIsLoading(false);
  };

  useEffect(() => {
    updateUrlMetrics(runId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  return (
    <>
      <style>
        {`
          .truncate-column {
            max-width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        `}
      </style>
      <Table
        size="small"
        loading={isLoading}
        dataSource={urlMetrics}
        columns={columns}
        pagination={false}
        expandable={{
          expandedRowRender
        }}
        summary={(pageData) => {
          let total = 0;
          let totalLatencyP50 = 0;
          let totalLatencyP99 = 0;
          let totalSuccessCount = 0;
          let totalRpm = 0;
          let totalErrorsCount = 0;
          let totalErrorRate = 0;
          const itemsCount = pageData.length;

          pageData.forEach(
            ({
              totalCount,
              latencyP50,
              latencyP99,
              successCount,
              rpm,
              // errorRate,
              errorsCount
            }) => {
              total += totalCount;
              totalLatencyP50 += latencyP50;
              totalLatencyP99 += latencyP99;
              totalSuccessCount += successCount;
              totalRpm += parseFloat(rpm);
              totalErrorRate = calculateErrorRate(totalSuccessCount, total);
              totalErrorsCount += errorsCount;
            }
          );

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  <Typography.Text strong>Total</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>
                    <Typography.Text strong>
                      {avg(totalLatencyP50, itemsCount).toFixed(2)}
                    </Typography.Text>
                    <span style={{ fontSize: 11 }}> ms</span>
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>
                    <Typography.Text strong>
                      {avg(totalLatencyP99, itemsCount).toFixed(2)}
                    </Typography.Text>
                    <span style={{ fontSize: 11 }}> ms</span>
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>{total}</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>{totalSuccessCount}</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>{totalErrorsCount}</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>{totalErrorRate}</Typography.Text>
                  <span style={{ fontSize: 11 }}> %</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    {avg(totalRpm, itemsCount).toFixed(0)}
                  </Typography.Text>
                  <span style={{ fontSize: 11 }}> req/min</span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default RunSummaryTable;
