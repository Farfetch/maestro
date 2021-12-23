import { Col, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageSpinner from "../components/layout/PageSpinner";
import RunAnalyticCharts from "../components/Run/AnalyticCharts";
import RunEndpointCharts from "../components/Run/EndpointCharts";
import RunStatusSteps from "../components/Run/StatusSteps";
import RunSummaryTable from "../components/Run/SummaryTable";
import { fetchRunById } from "../lib/api/endpoints/run";

const RunSinglePage = () => {
  const { runId } = useParams(null);
  const [run, setRun] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateRunData = async () => {
      setIsLoading(true);
      const runData = await fetchRunById(runId);

      setRun(runData);
      setIsLoading(false);
    };
    updateRunData();
  }, [runId]);

  return isLoading ? (
    <PageSpinner />
  ) : (
    <>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <RunStatusSteps runId={runId} />
        </Col>
        <Col span={24}>
          <Tabs defaultActiveKey="analytics">
            <Tabs.TabPane tab="Overview" key="overview">
              <RunAnalyticCharts runId={runId} loadProfile={run.loadProfile} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Summary" key="summary">
              <RunSummaryTable runId={runId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Endpoints" key="endpoints">
              <RunEndpointCharts runId={runId} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default RunSinglePage;
