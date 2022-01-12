import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, PageHeader, Result, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { fetchRunAgents } from "../../../lib/api/endpoints/runAgent";
import { runAgentStatus as runAgentStatusModel } from "../../../lib/api/models";
import { colors } from "../../../lib/colors";
import { agentLogsUrl, historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";
import PageSpinner from "../../layout/PageSpinner";

const { Paragraph, Text } = Typography;

const RunErrorStatus = ({ run }) => {
  const navigate = useNavigate();

  const [runAgents, setRunAgents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const loadAgentsData = async (runIdToLoad) => {
    const runAgentsData = await fetchRunAgents({ runId: runIdToLoad });

    const runAgentsWithError = runAgentsData.filter(
      ({ agentStatus }) => agentStatus === runAgentStatusModel.ERROR
    );
    setRunAgents(runAgentsWithError);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAgentsData(run.id);
  }, [run]);

  return (
    <PageHeader
      ghost={false}
      onBack={() => navigate(-1)}
      title={run.title}
      subTitle=""
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
        <Result
          status="error"
          title="Execution Failed"
          subTitle="Please check the configuration and logs before making a retry"
          extra={[
            <Link
              to={testSingleUrl(run.runConfigurationId)}
              key="configuration"
            >
              <Button type="primary">Go Configuration</Button>
            </Link>,

            <Button key="buy">Try Again</Button>
          ]}
        >
          <div className="desc">
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16
                }}
              >
                There are some unexpected errors from agents:
              </Text>
            </Paragraph>

            {runAgents.map(({ agentId, agentHostname, errorMessage }) => (
              <Paragraph key={`agentError-${agentId}`}>
                <Space>
                  <CloseCircleOutlined style={{ color: colors.red[5] }} />

                  <Link to={agentLogsUrl(agentId)}>{agentHostname}</Link>

                  {errorMessage}
                </Space>
              </Paragraph>
            ))}
          </div>
        </Result>
      )}
    </PageHeader>
  );
};

export default RunErrorStatus;
