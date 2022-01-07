import { Col, Row, Tabs } from "antd";

import RunAnalyticCharts from "./AnalyticCharts";
import RunEndpointCharts from "./EndpointCharts";
import RunSummaryTable from "./SummaryTable";

const RunRunningStatus = ({ runId, run }) => (
  <Row gutter={[0, 24]}>
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
);

export default RunRunningStatus;
