/* eslint-disable max-statements */
import { Descriptions } from "antd";
import React from "react";

import { avg } from "../../../../lib/utils";
import MetricCard from "./MetricCard";

const OverviewMetrics = ({ metrics, totals }) => (
  <div
    style={{
      border: "1px solid #fff "
    }}
  >
    <Descriptions>
      <div
        style={{
          flexWrap: "wrap"
        }}
      >
        <Descriptions.Item>
          <MetricCard
            title="Average Latency"
            value={avg(totals.totalLatencyAvg, metrics.length).toFixed(2)}
            unit="ms"
            borderColor="#ffd166"
          />
        </Descriptions.Item>
        <Descriptions.Item>
          <MetricCard
            title="90% Latency"
            value={avg(totals.totalLatencyP90, metrics.length).toFixed(2)}
            unit="ms"
            borderColor="#ffab40"
          />
        </Descriptions.Item>
        <Descriptions.Item>
          <MetricCard
            title="Errors"
            value={totals.totalErrorsRate}
            unit="%"
            borderColor="#ff6b6b"
          />
        </Descriptions.Item>
        <Descriptions.Item>
          <MetricCard
            title="Average RPM"
            value={avg(parseFloat(totals.totalRpm), metrics.length).toFixed(0)}
            unit="req/min"
            borderColor="#64b5f6"
          />
        </Descriptions.Item>
      </div>
    </Descriptions>
  </div>
);

export default OverviewMetrics;
