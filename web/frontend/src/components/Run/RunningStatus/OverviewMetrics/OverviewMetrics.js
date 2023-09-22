/* eslint-disable max-statements */
import { Descriptions } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";
import { runStatus as runStatusModel } from "../../../../lib/api/models";
import { avg } from "../../../../lib/utils";
import PageSpinner from "../../../layout/PageSpinner";
import MetricCard from "./MetricCard";

const OverviewMetrics = ({ run }) => {
  const [runMetrics, setrunMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totals, setTotals] = useState({
    totalLatencyAvg: 0,
    totallatencyP90: 0,
    totalSuccessCount: 0,
    totalCount: 0,
    totalRpm: 0
  });
  const refreshInterval = 3000;
  const timerRef = useRef(null);

  const calculateErrorRate = (successCount, totalCount) => {
    const errorRate = parseFloat((1 - successCount / totalCount) * 100).toFixed(
      2
    );

    return errorRate;
  };

  const updaterunMetrics = async (runIdToFetch) => {
    setIsLoading(true);

    const metricsRes = await fetchMetrics(runIdToFetch, 0, true);

    const getRpm = (minDatetime, maxDatetime, totalCount) => {
      const dateDuration = moment.duration(maxDatetime.diff(minDatetime));
      const diffInSeconds =
        dateDuration.asSeconds() > 0 ? dateDuration.asSeconds() : 1;

      return parseFloat((totalCount / diffInSeconds) * 60).toFixed(0);
    };

    const formattedrunMetrics = metricsRes.map(
      ({
        minDatetime,
        maxDatetime,
        totalCount,
        successCount,
        label,
        latencyAvg,
        latencyP90,
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
          latencyP90,
          responses
        };
      }
    );

    setrunMetrics(formattedrunMetrics);

    setIsLoading(false);
  };

  const calculateTotals = () => {
    const totalLatencyAvg =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.latencyAvg, 0)
        : 0;
    const totallatencyP90 =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.latencyP90, 0)
        : 0;
    const totalSuccessCount =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.successCount, 0)
        : 0;
    const totalCount =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.totalCount, 0)
        : 0;
    const totalRpm =
      runMetrics.length > 0
        ? runMetrics.reduce(
            (total, metric) => total + parseFloat(metric.rpm),
            0
          )
        : 0;

    setTotals({
      totalLatencyAvg,
      totallatencyP90,
      totalSuccessCount,
      totalCount,
      totalRpm
    });
  };

  const startMetricsRefreshTimer = () => {
    if (run.runStatus === runStatusModel.RUNNING) {
      timerRef.current = setInterval(() => {
        updaterunMetrics(run.id);
      }, refreshInterval);
    }
  };

  const stopMetricsRefreshTimer = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    updaterunMetrics(run.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  useEffect(() => {
    calculateTotals();
    startMetricsRefreshTimer();
    return () => {
      stopMetricsRefreshTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runMetrics, run.runStatus]);

  return isLoading ? (
    <PageSpinner />
  ) : (
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
              value={avg(totals.totalLatencyAvg, runMetrics.length).toFixed(2)}
              unit="ms"
              borderColor="#ffd166"
            />
          </Descriptions.Item>
          <Descriptions.Item>
            <MetricCard
              title="90% Latency"
              value={avg(totals.totallatencyP90, runMetrics.length).toFixed(2)}
              unit="ms"
              borderColor="#ffab40"
            />
          </Descriptions.Item>
          <Descriptions.Item>
            <MetricCard
              title="Errors"
              value={calculateErrorRate(
                totals.totalSuccessCount,
                totals.totalCount
              )}
              unit="%"
              borderColor="#ff6b6b"
            />
          </Descriptions.Item>
          <Descriptions.Item>
            <MetricCard
              title="Average RPM"
              value={avg(
                parseFloat(totals.totalRpm),
                runMetrics.length
              ).toFixed(0)}
              unit="req/min"
              borderColor="#64b5f6"
            />
          </Descriptions.Item>
        </div>
      </Descriptions>
    </div>
  );
};

export default OverviewMetrics;
