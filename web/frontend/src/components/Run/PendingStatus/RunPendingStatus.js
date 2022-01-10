import {
  Button,
  Col,
  PageHeader,
  // Progress,
  Row,
  Space,
  Steps,
  Typography
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchAgents } from "../../../lib/api/endpoints/agent";
import { historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";
import CircleSpinner from "../../layout/CircleSpinner";
import PageSpinner from "../../layout/PageSpinner";

const { Step } = Steps;

const RunPendingStatus = ({ run }) => {
  const navigate = useNavigate();

  // TODO: fetch agents per test
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAgentsData = async () => {
    setIsLoading(true);

    const agentsRes = await fetchAgents();

    setAgents(agentsRes);

    setIsLoading(false);
  };

  useEffect(() => {
    loadAgentsData();
  }, []);

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
      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <Row
            gutter={[80, 0]}
            align="middle"
            justify="center"
            style={{ paddingTop: "40px" }}
          >
            <Col span={12}>
              <Steps current={1} direction="vertical" percent={60}>
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
                {agents.map(({ hostname }) => (
                  <Col span={24}>
                    <Space>
                      {/* <Progress type="circle" percent={100} width={20} /> */}
                      <CircleSpinner size={20} />
                      <Typography.Text strong={true}>
                        {hostname}
                      </Typography.Text>
                    </Space>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </>
      )}
    </PageHeader>
  );
};

export default RunPendingStatus;
