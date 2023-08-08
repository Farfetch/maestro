import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import AgentsListTable from "../components/Agents/ListTable";
import PageTitle from "../components/layout/PageTitle";
import { fetchAgents } from "../lib/api/endpoints/agent";

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateTestPlans = async () => {
    setIsLoading(true);

    const agentsRes = await fetchAgents();

    setAgents(agentsRes);

    setIsLoading(false);
  };

  useEffect(() => {
    updateTestPlans();
  }, []);
  return (
    <>
      <PageTitle title={"Agents"} />
      <Row gutter={[32, 32]} justify="start" align="middle">
        <Col span={24}>
          <AgentsListTable
            isLoading={isLoading}
            agents={agents}
            updateTestPlans={updateTestPlans}
          />
        </Col>
      </Row>
    </>
  );
};

export default AgentsPage;
