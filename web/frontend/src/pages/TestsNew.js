import { Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";

import PageSpinner from "../components/layout/PageSpinner";
import RunConfigurationForm from "../components/RunConfiguration/Form";
import { fetchAgents } from "../lib/api/endpoints/agent";

const { Title } = Typography;

const TestsNewPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState([]);

  const updateAgentsList = async () => {
    setIsLoading(true);
    const agentsRes = await fetchAgents();
    setAgents(agentsRes);
    setIsLoading(false);
  };
  useEffect(() => {
    updateAgentsList();
  }, []);

  return (
    <>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={2}>Test Configuration</Title>
          </Col>
          <Col span={24}>
            <RunConfigurationForm agents={agents} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default TestsNewPage;
