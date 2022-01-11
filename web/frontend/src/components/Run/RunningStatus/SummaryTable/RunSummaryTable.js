import { Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";

const columns = [
  {
    title: "Label",
    dataIndex: "label",
    key: "label",
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
    width: 150
  },
  {
    title: "Success",
    dataIndex: "successCount",
    key: "successCount",
    render: (text, record) => (
      <span key={`${record.url}-successCount`}>{`${record.successCount}`}</span>
    ),
    sorter: {
      compare: (recordA, recordB) => recordA.successCount - recordB.successCount
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
    width: 150
  },
  {
    title: "Error rate",
    dataIndex: "errorRate",
    key: "errorRate",
    defaultSortOrder: "descend",
    width: 100,
    render: (text, record) => (
      <span key={`${record.url}-error_rate`}>
        {record.errorRate}
        <span style={{ fontSize: 11 }}>%</span>
      </span>
    ),
    sorter: {
      compare: (recordA, recordB) => recordA.errorRate - recordB.errorRate
    }
  }
];

const RunSummaryTable = ({ runId }) => {
  const [urlMetrics, setUrlMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        latencyP50
      }) => {
        const errorsCount = totalCount - successCount;
        const errorRate = parseFloat((errorsCount / totalCount) * 100).toFixed(
          2
        );
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
          latencyP50
        };
      }
    );

    setUrlMetrics(formattedUrlMetrics);

    setIsLoading(false);
  };

  useEffect(() => {
    updateUrlMetrics(runId);
  }, [runId]);

  return (
    <>
      <Table
        size="small"
        loading={isLoading}
        dataSource={urlMetrics}
        columns={columns}
        pagination={{
          defaultPageSize: 200,
          hideOnSinglePage: true,
          pageSizeOptions: [50, 100, 200, 1000],
          position: ["bottomRight"]
        }}
      />
    </>
  );
};

export default RunSummaryTable;
