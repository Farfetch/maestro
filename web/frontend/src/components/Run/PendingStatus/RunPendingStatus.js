import { Button, Col, PageHeader, Row, Steps } from "antd";
import { useNavigate } from "react-router-dom";

import { runStatus as runStatusModel } from "../../../lib/api/models";
import { historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";
import RunPendingStatusAgentsList from "./AgentsList";

const { Step } = Steps;

const RunPendingStatus = ({ run }) => {
  const navigate = useNavigate();

  const calculateCurrentStep = (currentRunStatus) => {
    switch (currentRunStatus) {
      case runStatusModel.CREATING:
        return 0;
      case runStatusModel.PENDING:
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
      breadcrumbName: "Running"
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
