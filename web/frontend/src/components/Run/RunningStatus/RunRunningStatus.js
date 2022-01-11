import { Button, Col, PageHeader, Row, Tabs } from "antd";
import { useNavigate } from "react-router-dom";

import { historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";
import RunAnalyticCharts from "./AnalyticCharts";
import RunEndpointCharts from "./EndpointCharts";
import RunSummaryTable from "./SummaryTable";

const RunRunningStatus = ({ runId, run }) => {
  const navigate = useNavigate();

  const routes = [
    {
      path: historyUrl,
      breadcrumbName: "History"
    },

    {
      path: testSingleUrl(run.runConfigurationId),
      breadcrumbName: "Configuration"
    },
    {
      path: "index",
      breadcrumbName: "Run"
    }
  ];

  return (
    <PageHeader
      ghost={false}
      onBack={() => navigate(-1)}
      title={run.title}
      subTitle=""
      extra={[
        <Button key="1" type="primary" danger={true}>
          Stop Execution
        </Button>
      ]}
      breadcrumb={{
        routes,
        itemRender: (route, params, routesToRender) => (
          <Breadcrumb route={route} routes={routesToRender} />
        )
      }}
    >
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
    </PageHeader>
  );
};
export default RunRunningStatus;
