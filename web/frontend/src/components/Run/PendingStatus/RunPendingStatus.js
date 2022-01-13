import { Button, Col, PageHeader, Popconfirm, Row, Steps } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { stopRun } from "../../../lib/api/endpoints/run";
import { runStatus as runStatusModel } from "../../../lib/api/models";
import { historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";
import RunPendingStatusAgentsList from "./AgentsList";

const { Step } = Steps;

const RunPendingStatus = ({ run }) => {
  const navigate = useNavigate();

  const calculateCurrentStep = (currentRunStatus) => {
    switch (currentRunStatus) {
      case runStatusModel.PENDING:
        return 0;
      case runStatusModel.CREATING:
        return 1;
      case runStatusModel.RUNNING:
        return 2;
      case runStatusModel.STOPPED:
      case runStatusModel.FINISHED:
        return 3;

      default:
        throw new Error(
          `${currentRunStatus} test running status step is not defined`
        );
    }
  };

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

  return (
    <PageHeader
      ghost={false}
      onBack={() => navigate(-1)}
      title={run.title}
      subTitle=""
      extra={[
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
      ]}
      breadcrumb={{
        routes,
        itemRender: (route, params, routesToRender) => (
          <Breadcrumb route={route} routes={routesToRender} />
        )
      }}
    >
      <>
        <Row
          gutter={[80, 0]}
          align="middle"
          justify="center"
          style={{ paddingTop: "40px" }}
        >
          <Col span={12}>
            <Steps
              current={calculateCurrentStep(run.runStatus)}
              direction="vertical"
              percent={60}
            >
              <Step
                title="Waiting"
                description="Some of agents might be busy of others tests."
              />
              <Step
                title="Preparing"
                description="Agents started building assets that are needed to start a test. We're alsomost there!"
              />

              <Step
                title="Running"
                description="Real time metrics would be available to monitor the execution."
              />
            </Steps>
          </Col>
          <Col span={12}>
            <Row gutter={[0, 15]}>
              <RunPendingStatusAgentsList runId={run.id} />
            </Row>
          </Col>
        </Row>
      </>
    </PageHeader>
  );
};

export default RunPendingStatus;
