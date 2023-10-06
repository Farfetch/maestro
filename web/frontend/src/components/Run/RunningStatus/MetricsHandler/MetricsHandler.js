/* eslint-disable max-statements */
import moment from "moment";
import { useEffect, useRef, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";
import { runStatus as runStatusModel } from "../../../../lib/api/models";
import { calculateErrorRate } from "../../../../lib/utils";

const MetricsHandler = ({ run, children }) => {
  const [runMetrics, setMetrics] = useState([]);
  const [errorCodes, setErrorCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totals, setTotals] = useState({
    totalLatencyAvg: 0,
    totalLatencyP50: 0,
    totalLatencyP90: 0,
    totalLatencyP99: 0,
    totalSuccessCount: 0,
    totalErrorsCount: 0,
    totalErrorsRate: 0,
    totalCount: 0,
    totalRpm: 0
  });
  const refreshInterval = 5000;
  const timerRef = useRef(null);

  const updateRunMetrics = async (runIdToFetch) => {
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
        latencyP90,
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
          latencyP90,
          latencyP99,
          responses
        };
      }
    );

    setMetrics(formattedUrlMetrics);
    setIsLoading(false);
  };

  const calculateTotals = () => {
    const totalLatencyAvg =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.latencyAvg, 0)
        : 0;
    const totalLatencyP50 =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.latencyP50, 0)
        : 0;
    const totalLatencyP90 =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.latencyP90, 0)
        : 0;
    const totalLatencyP99 =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.latencyP99, 0)
        : 0;
    const totalSuccessCount =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.successCount, 0)
        : 0;
    const totalErrorsCount =
      runMetrics.length > 0
        ? runMetrics.reduce((total, metric) => total + metric.errorsCount, 0)
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
    const totalErrorsRate = parseFloat(
      calculateErrorRate(totalSuccessCount, totalCount)
    );

    setTotals({
      totalLatencyAvg,
      totalLatencyP50,
      totalLatencyP90,
      totalLatencyP99,
      totalSuccessCount,
      totalErrorsCount,
      totalErrorsRate,
      totalCount,
      totalRpm
    });
  };

  const groupByErrorCode = () => {
    const responseCodeGroups = {};

    runMetrics.forEach((metric) => {
      metric.responses.forEach((response) => {
        const { responseCode } = response;

        if (!responseCodeGroups[responseCode]) {
          responseCodeGroups[responseCode] = [];
        }

        responseCodeGroups[responseCode].push(metric);
      });
    });

    setErrorCodes(responseCodeGroups);
  };

  const startMetricsRefreshTimer = () => {
    if (run.runStatus === runStatusModel.RUNNING) {
      timerRef.current = setInterval(() => {
        updateRunMetrics(run.id);
      }, refreshInterval);
    }
  };

  const stopMetricsRefreshTimer = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    updateRunMetrics(run.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run.id]);

  useEffect(() => {
    calculateTotals();
    groupByErrorCode();
    startMetricsRefreshTimer();
    return () => {
      stopMetricsRefreshTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runMetrics, run.runStatus]);

  return children(runMetrics, isLoading, totals, errorCodes);
};

export default MetricsHandler;
