import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Button, Col, PageHeader, Popconfirm, Row, Tabs, Tag } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { restartRun, stopRun } from "../../../lib/api/endpoints/run";
import { runStatus as runStatusModel } from "../../../lib/api/models";
import { historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";
import RunAnalyticCharts from "./AnalyticCharts";
import RunEndpointCharts from "./EndpointCharts";
import RunSummaryTable from "./SummaryTable";

const RunRunningStatus = ({ run }) => {
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

  const onStop = useCallback(() => {
    stopRun(run.id);
  }, [run]);

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
        return [
          <Popconfirm
            placement="left"
            key="restart"
            title={
              <>
                <p>Are you sure you want to stop the test?</p>
                <p>You will not be able to resume the test.</p>
              </>
            }
            okText="Yes"
            cancelText="No"
            onConfirm={onStop}
          >
            <Button key="stop" type="primary" danger={true}>
              Stop Execution
            </Button>
          </Popconfirm>
        ];
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
              <RunAnalyticCharts runId={run.id} loadProfile={run.loadProfile} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Summary" key="summary">
              <RunSummaryTable runId={run.id} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Endpoints" key="endpoints">
              <RunEndpointCharts runId={run.id} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </PageHeader>
  );
};
export default RunRunningStatus;
