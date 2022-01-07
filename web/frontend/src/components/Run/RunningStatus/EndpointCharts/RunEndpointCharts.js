/* eslint-disable max-statements */
import { Button, Col, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";
import PageSpinner from "../../../layout/PageSpinner";
import HitsErrorsLabelLine from "./HitsErrorsLabelLine";

const RunEndpointsCharts = ({ runId }) => {
  const defaultTimeInterval = 15;
  const showLabels = true;
  const [runMetrics, setRunMetrics] = useState([]);
  const [labelsToShow, setLabelsToShow] = useState([]);
  const [timeInterval, setTimeInterval] = useState(defaultTimeInterval);
  const [isLoading, setIsLoading] = useState(false);

  const updateRunMetrics = async (runIdToFetch) => {
    setIsLoading(true);
    const metrics = await fetchMetrics(runIdToFetch, timeInterval, showLabels);

    setRunMetrics(metrics);

    setIsLoading(false);
  };

  useEffect(() => {
    updateRunMetrics(runId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  const refreshChart = async () => {
    const metrics = await fetchMetrics(runId, timeInterval, showLabels);

    setRunMetrics(metrics);
  };

  const labels = Array.from(new Set(runMetrics.map(({ label }) => label)));

  return (
    <>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <Row type="flex" gutter={[10, 24]}>
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
                    ))
                  </Select>
                </>
                <Button type="primary" onClick={refreshChart}>
                  Refresh
                </Button>
              </Space>
            </Col>
            <Col span={24}>
              <HitsErrorsLabelLine
                metrics={runMetrics}
                labelsToShow={labelsToShow}
              />
            </Col>
            <Col
              span={24}
              flex="1"
              style={{
                textAlign: "start"
              }}
            >
              <Space align="center">
                <>
                  Labels:
                  <Select
                    mode="multiple"
                    style={{
                      width: "100%",
                      minWidth: "600px",
                      margin: "0 auto"
                    }}
                    placeholder="Choose label"
                    defaultValue={labels[0] || false}
                    onChange={(value) => setLabelsToShow(value)}
                  >
                    {labels.map((label) => (
                      <Select.Option key={label}>{label}</Select.Option>
                    ))}
                    ))
                  </Select>
                </>
              </Space>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
export default RunEndpointsCharts;
