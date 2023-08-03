/* eslint-disable max-statements */
import { Button, Checkbox, Col, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";
import { runStatus as runStatusModel } from "../../../../lib/api/models";
import PageSpinner from "../../../layout/PageSpinner";
import HitsErrorsLine from "./HitsErrorsLine";
import ResponseCodesLine from "./ResponseCodesLine";
import ResponseTimeLine from "./ResponseTimeLine";
import WaitingForMetricsResult from "./WaitingForMetricsResult";

const RunningTestAnalytics = ({
  run,
  loadProfile = [],
  isLoadProfileEnabled,
  isRunMetricsAvailable,
  setIsRunMetricsAvailable
}) => {
  const defaultTimeInterval = 5;
  const updateChartsInterval = 5000;
  const [runMetrics, setRunMetrics] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeInterval, setTimeInterval] = useState(defaultTimeInterval);
  const [isLoading, setIsLoading] = useState(false);
  const [isIntervalLoading, setIsIntervalLoading] = useState(false);

  const updateRunMetrics = async (runIdToFetch) => {
    setIsLoading(true);
    setIsIntervalLoading(true);
    const metrics = await fetchMetrics(runIdToFetch, timeInterval);

    setRunMetrics(metrics);

    setIsLoading(false);
    setIsIntervalLoading(false);
  };

  useEffect(() => {
    updateRunMetrics(run.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  useEffect(() => {
    const interval = setInterval(async () => {
      // Checks is there any request that is made to API that should be finished before
      if (autoRefresh && !isLoading && !isIntervalLoading) {
        setIsIntervalLoading(true);
        const metrics = await fetchMetrics(run.id, timeInterval);

        setRunMetrics(metrics);
        setIsIntervalLoading(false);
      }
    }, updateChartsInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, isLoading, isIntervalLoading, run.id, timeInterval]);

  // Enable all tabs once Metrics are available
  useEffect(() => {
    if (!isRunMetricsAvailable) {
      if (runMetrics.length > 0) {
        setIsRunMetricsAvailable(true);
      }
    }
  }, [isRunMetricsAvailable, runMetrics, setIsRunMetricsAvailable]);

  const refreshChart = async () => {
    const metrics = await fetchMetrics(run.id, timeInterval);

    setRunMetrics(metrics);
  };

  if (isLoading) return <PageSpinner />;

  if ((run.runStatus === runStatusModel.RUNNING && runMetrics.length) === 0)
    return <WaitingForMetricsResult run={run} />;

  return (
    <Row type="flex" gutter={[0, 24]}>
      <Col span={16}>
        <Space align="center">
          <>
            Interval:
            <Select
              mode="single"
              style={{ width: "100px" }}
              placeholder="Choose time interval"
              defaultValue={defaultTimeInterval}
              onChange={(value) => setTimeInterval(value)}
            >
              <Select.Option key={1}>1 sec</Select.Option>
              <Select.Option key={5}>5 sec</Select.Option>
              <Select.Option key={10}>10 sec</Select.Option>
              <Select.Option key={15}>15 sec</Select.Option>
              <Select.Option key={30}>30 sec</Select.Option>
              <Select.Option key={60}>60 sec</Select.Option>
            </Select>
          </>
          <Button type="primary" onClick={refreshChart}>
            Refresh
          </Button>
        </Space>
      </Col>
      <Col
        span={8}
        flex="1"
        style={{
          textAlign: "end"
        }}
      >
        <Space align="center">
          <Checkbox
            defaultChecked
            onChange={(e) => setAutoRefresh(e.target.checked)}
          >
            Auto refresh
          </Checkbox>
        </Space>
      </Col>

      <Col span={24}>
        <HitsErrorsLine
          metrics={runMetrics}
          loadProfile={loadProfile}
          isLoadProfileEnabled={isLoadProfileEnabled}
        />
      </Col>
      <Col span={24}>
        <ResponseTimeLine metrics={runMetrics} />
      </Col>
      <Col span={24}>
        <ResponseCodesLine metrics={runMetrics} />
      </Col>
    </Row>
  );
};
export default RunningTestAnalytics;
