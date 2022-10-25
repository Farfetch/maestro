import {
  Button,
  Col,
  PageHeader,
  Popconfirm,
  Row,
  Space,
  Tabs,
  Typography
} from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { restartRun } from "../../../lib/api/endpoints/run";
import { runStatus as runStatusModel } from "../../../lib/api/models";
import { historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";
import RunStatusTag from "../../tag/RunStatusTag";
import RunAnalyticCharts from "./AnalyticCharts";
import DownloadMetricsButton from "./DownloadMetricsButton";
import RunEditableLabelsGroup from "./EditableLabelsGroup";
import RunEndpointCharts from "./EndpointCharts";
import MoreButtonsMenu from "./MoreButtonsMenu";
import RunNotesInput from "./NotesInput";
import RunRunningTime from "./RunningTime";
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

  const isTimerAvailable =
    (run.runStatus === runStatusModel.RUNNING && isRunMetricsAvailable) ||
    run.runStatus === runStatusModel.STOPPED ||
    run.runStatus === runStatusModel.FINISHED;

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
          </Popconfirm>,
          <DownloadMetricsButton runId={run.id} key="downloadMetrics" />,
          <MoreButtonsMenu runId={run.id} key="moreButtonsMenu" />
        ];
      default:
        if (!isRunMetricsAvailable) return [];
        return [<StopExecutionButton runId={run.id} key="stopExecution" />];
    }
  };

  return (
    <PageHeader
      ghost={false}
      onBack={() => navigate(-1)}
      title={run.title}
      subTitle={
        <RunStatusTag
          runStatus={run.runStatus}
          key={`tag-${run.id}-${run.runStatus}`}
        />
      }
      extra={getButtonsByStatus(run.runStatus)}
      breadcrumb={{
        routes,
        itemRender: (route, params, routesToRender) => (
          <Breadcrumb route={route} routes={routesToRender} />
        )
      }}
      tags={<RunEditableLabelsGroup runId={run.id} defaultValue={run.labels} />}
    >
      <Row gutter={[0, 0]} type="flex" align="middle" justify="end">
        <Col span={16}>
          <Space direction="vertical" size={0}>
            <RunNotesInput
              runId={run.id}
              defaultValue={run.notes || "Add running test execution notes..."}
            />

            <Space size="large">
              <div>
                <Typography.Text type="secondary">Started at: </Typography.Text>
                {run.startedAt ? run.startedAt.format("L HH:mm:ss") : null}
              </div>
              <div>
                <Typography.Text type="secondary">Agents: </Typography.Text>
                {run.agentIds.length}
              </div>
            </Space>
          </Space>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          {isTimerAvailable ? (
            <>
              <RunRunningTime
                startedAt={run.startedAt}
                finishedAt={
                  run.runStatus !== runStatusModel.RUNNING
                    ? run.finishedAt
                    : false
                }
              />
            </>
          ) : null}
        </Col>

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
              <RunEndpointCharts run={run} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </PageHeader>
  );
};
export default RunRunningStatus;
