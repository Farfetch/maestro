import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Button, Col, PageHeader, Popconfirm, Row, Tabs, Tag } from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { restartRun } from "../../../lib/api/endpoints/run";
import { runStatus as runStatusModel } from "../../../lib/api/models";
import { historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";
import RunAnalyticCharts from "./AnalyticCharts";
import RunEndpointCharts from "./EndpointCharts";
import StopExecutionButton from "./StopExecutionButton";
import RunSummaryTable from "./SummaryTable";

const RunRunningStatus = ({ run }) => {
  const navigate = useNavigate();
  const [isRunMetricsAvailable, setIsRunMetricsAvailable] = useState(false);

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

  const onRestart = useCallback(() => {
    restartRun(run.id);
  }, [run]);

  const getButtonsByStatus = (runStatus) => {
    switch (runStatus) {
      case runStatusModel.STOPPED:
      case runStatusModel.FINISHED:
        return [
          <Popconfirm
            key="restart"
            placement="left"
            title={
              <>
                <p>Are you sure you want to restart test?</p>
                <p>All metrics would be deleted. </p>
              </>
            }
            okText="Yes"
            cancelText="No"
            onConfirm={onRestart}
          >
            <Button type="secondary">Restart</Button>
          </Popconfirm>
        ];
      default:
        if (!isRunMetricsAvailable) return [];
        return [<StopExecutionButton runId={run.id} key="stopExecution" />];
    }
  };

  const getTagByStatus = (runStatus) => {
    switch (runStatus) {
      case runStatusModel.RUNNING:
        return (
          <Tag key="processing" icon={<SyncOutlined spin />} color="processing">
            {runStatus}
          </Tag>
        );
      case runStatusModel.STOPPED:
        return (
          <Tag key="error" icon={<CloseCircleOutlined />} color="error">
            {runStatus}
          </Tag>
        );
      case runStatusModel.FINISHED:
        return (
          <Tag key="success" icon={<CheckCircleOutlined />} color="success">
            {runStatus}
          </Tag>
        );
      default:
        return <Tag key="default">{runStatus}</Tag>;
    }
  };

  return (
    <PageHeader
      ghost={false}
      onBack={() => navigate(-1)}
      title={run.title}
      subTitle=""
      extra={getButtonsByStatus(run.runStatus)}
      breadcrumb={{
        routes,
        itemRender: (route, params, routesToRender) => (
          <Breadcrumb route={route} routes={routesToRender} />
        )
      }}
      tags={[getTagByStatus(run.runStatus)]}
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Tabs defaultActiveKey="analytics">
            <Tabs.TabPane tab="Overview" key="overview">
              <RunAnalyticCharts
                run={run}
                loadProfile={run.loadProfile}
                isRunMetricsAvailable={isRunMetricsAvailable}
                setIsRunMetricsAvailable={setIsRunMetricsAvailable}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="Summary"
              key="summary"
              disabled={!isRunMetricsAvailable}
            >
              <RunSummaryTable runId={run.id} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="Endpoints"
              key="endpoints"
              disabled={!isRunMetricsAvailable}
            >
              <RunEndpointCharts runId={run.id} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </PageHeader>
  );
};
export default RunRunningStatus;
