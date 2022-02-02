import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import PageTitle from "../components/layout/PageTitle";
import RunListTable from "../components/Run/ListTable";
import { fetchRuns } from "../lib/api/endpoints/run";

const HistoryPage = () => {
  const [runs, setRuns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateRunPlans = async () => {
    setIsLoading(true);

    const runsRes = await fetchRuns();

    setRuns(runsRes);

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
