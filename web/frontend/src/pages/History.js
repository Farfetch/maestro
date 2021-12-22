import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import PageTitle from "../components/layout/PageTitle";
import RunListTable from "../components/Run/ListTable";
import { fetchAgents } from "../lib/api/endpoints/agent";
import { fetchRuns } from "../lib/api/endpoints/run";
import { fetchRunPlans } from "../lib/api/endpoints/runPlan";

const HistoryPage = () => {
  const [runs, setRuns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateRunPlans = async () => {
    setIsLoading(true);

    const runPlans = await fetchRunPlans();
    const findRunPlan = (run) =>
      runPlans.find((runPlan) => runPlan.id === run.runPlanId);

    const agents = await fetchAgents();

    const findAgents = (agentIds) =>
      agentIds.map((agentId) => agents.find((d) => d.id === agentId));

    const runsRes = await fetchRuns();

    const runsWithTitles = runsRes.map((run) => ({
      ...run,
      runPlan: findRunPlan(run),
      agents: findAgents([run.clientAgentId, ...run.serverAgentIds])
    }));

    setRuns(runsWithTitles);

    setIsLoading(false);
  };

  useEffect(() => {
    updateRunPlans();
  }, []);

  return (
    <>
      <PageTitle title="History" />
      <Row>
        <Col span={24}>
          <RunListTable isLoading={isLoading} runs={runs} />
        </Col>
      </Row>
    </>
  );
};

export default HistoryPage;
