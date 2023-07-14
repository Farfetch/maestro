/* eslint-disable max-statements */
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { orderBy } from "lodash";
import React, { useEffect, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";
import PageSpinner from "../../../layout/PageSpinner";
import HitsErrorsLabelLine from "./HitsErrorsLabelLine";

const RunEndpointsCharts = ({ run, labelToShowGraph }) => {
  const defaultTimeInterval = 5;
  const showLabels = true;
  const [runMetrics, setRunMetrics] = useState([]);
  const [labelsToShow, setLabelsToShow] = useState([labelToShowGraph]);
  const [timeInterval, setTimeInterval] = useState(defaultTimeInterval);
  const [isLoading, setIsLoading] = useState(false);
  const [excludedPrefix, setExcludedPrefix] = useState("UJ");

  const updateRunMetrics = async (runIdToFetch) => {
    setIsLoading(true);
    const metrics = await fetchMetrics(runIdToFetch, timeInterval, showLabels);

    setRunMetrics(metrics);

    setIsLoading(false);
  };

  useEffect(() => {
    updateRunMetrics(run.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const refreshChart = async () => {
    const metrics = await fetchMetrics(run.id, timeInterval, showLabels);

    setRunMetrics(metrics);
  };

  const labels = orderBy(
    Array.from(new Set(runMetrics.map(({ label }) => label)))
  );

  useEffect(() => {
    setLabelsToShow(labelToShowGraph);
  }, [labelToShowGraph]);

  const handleExcludePrefix = () => {
    if (excludedPrefix) {
      if (labelsToShow) {
        setLabelsToShow(
          labelsToShow.filter((label) => !label.startsWith(excludedPrefix))
        );
      }
      const updatedLabels = labels.filter(
        (label) => !label.startsWith(excludedPrefix)
      );
      setRunMetrics(
        runMetrics.filter((metric) => updatedLabels.includes(metric.label))
      );
    }
  };

  return (
    <Form>
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
                  </Select>
                </>
                <>
                  Labels:
                  <Select
                    mode="multiple"
                    style={{
                      width: "500px"
                    }}
                    placeholder="All"
                    onChange={(value) => {
                      setLabelsToShow(value);
                    }}
                    value={labelsToShow ? [labelsToShow].flat() : []}
                    maxTagCount="responsive"
                    allowClear={true}
                  >
                    {labels.map((label) => (
                      <Select.Option key={label}>{label}</Select.Option>
                    ))}
                  </Select>
                </>
                <Button type="primary" onClick={refreshChart}>
                  Refresh
                </Button>
                <Form.Item
                  name="excludedPrefix"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Please enter the prefix to exclude"
                    }
                  ]}
                >
                  <Input
                    placeholder="Enter the prefix to exclude"
                    value={excludedPrefix}
                    onChange={(e) => setExcludedPrefix(e.target.value)}
                    style={{ width: "200px" }}
                    allowClear={true}
                  />
                </Form.Item>
                <Button type="primary" onClick={handleExcludePrefix}>
                  Exclude
                </Button>
              </Space>
            </Col>
            <Col span={24}>
              <HitsErrorsLabelLine
                run={run}
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
              <Space align="center"></Space>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};
export default RunEndpointsCharts;
