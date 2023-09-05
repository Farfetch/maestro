/* eslint-disable max-statements */

import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Tag
} from "antd";
import { orderBy } from "lodash";
import React, { useEffect, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";
import PageSpinner from "../../../layout/PageSpinner";
import HitsErrorsLabelLine from "./HitsErrorsLabelLine";

const RunEndpointsCharts = ({ run, labelToShowGraph }) => {
  const defaultTimeInterval = 5;
  const showLabels = true;
  const [runMetrics, setRunMetrics] = useState([]);
  const [copyRunMetrics, setCopyRunMetrics] = useState([]);
  const [labelsToShow, setLabelsToShow] = useState([labelToShowGraph]);
  const [timeInterval, setTimeInterval] = useState(defaultTimeInterval);
  const [isLoading, setIsLoading] = useState(false);
  const [excludedPrefix, setExcludedPrefix] = useState("UJ");
  const [excludedPrefixes, setExcludedPrefixes] = useState([]);

  const updateRunMetrics = async (runIdToFetch) => {
    setIsLoading(true);
    const metrics = await fetchMetrics(runIdToFetch, timeInterval, showLabels);

    setRunMetrics(metrics);
    setCopyRunMetrics(metrics);
    setIsLoading(false);
  };

  useEffect(() => {
    updateRunMetrics(run.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const refreshChart = async () => {
    let metrics = [];
    if (run.runStatus === "RUNNING") {
      metrics = await fetchMetrics(run.id, timeInterval, showLabels);
    } else {
      metrics = copyRunMetrics;
      setExcludedPrefixes([]);
    }

    setRunMetrics(metrics);
  };

  const labels = orderBy(
    Array.from(new Set(runMetrics.map(({ label }) => label)))
  );

  useEffect(() => {
    setLabelsToShow(labelToShowGraph);
  }, [labelToShowGraph]);

  const handleExcludePrefix = () => {
    if (!excludedPrefixes.includes(excludedPrefix)) {
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

        setExcludedPrefixes((prevExcludedPrefixes) => [
          ...prevExcludedPrefixes,
          excludedPrefix
        ]);

        setExcludedPrefix("");
      }
    } else {
      message.warning({ content: "Prefix already added", duration: 3 });
    }
  };

  const handleRemoveExcludedPrefix = (prefixToRemove) => {
    setExcludedPrefixes((prevExcludedPrefixes) =>
      prevExcludedPrefixes.filter((prefix) => prefix !== prefixToRemove)
    );
    refreshChart();
  };

  const truncateLabel = (label, maxLength) => {
    if (label.length <= maxLength) {
      return label;
    }
    return `${label.slice(0, maxLength)}...`;
  };

  const handleSelectAll = () => {
    setLabelsToShow(labels);
  };

  const handleUnselectAll = () => {
    setLabelsToShow([]);
  };

  return (
    <Form>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <Row type="flex" gutter={[10, 24]}>
            <Col span={16}>
              <Space align="center" style={{ marginBottom: "16px" }}>
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
                      <Select.Option key={label} className="truncate-option">
                        {truncateLabel(label, 40)}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button type="primary" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button type="danger" onClick={handleUnselectAll}>
                    Unselect All
                  </Button>
                  <Button onClick={refreshChart}>Refresh</Button>
                </>
              </Space>
              <Space align="center">
                <>
                  <div style={{ marginRight: "-4px" }}>Prefixes:</div>
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
                      placeholder="Enter prefix to exclude"
                      value={excludedPrefix}
                      onChange={(e) => setExcludedPrefix(e.target.value)}
                      style={{ width: "200px", marginRight: "5px" }}
                      allowClear={true}
                    />
                  </Form.Item>
                  <Button type="primary" onClick={handleExcludePrefix}>
                    Exclude
                  </Button>
                  {excludedPrefixes.length > 0 && (
                    <div style={{ marginTop: "4px" }}>
                      Prefixes:
                      {excludedPrefixes.map((prefix) => (
                        <Tag
                          key={prefix}
                          closable={true}
                          onClose={() => handleRemoveExcludedPrefix(prefix)}
                          style={{ margin: "2px" }}
                        >
                          {prefix}
                        </Tag>
                      ))}
                    </div>
                  )}
                </>
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
