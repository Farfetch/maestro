import { Col, Row } from "antd";
import { useContext, useEffect, useState } from "react";

import PageTitle from "../components/layout/PageTitle";
import RunListTable from "../components/Run/ListTable";
import { CurrentWorkspaceContext } from "../context/CurrentWorkspace";
import { fetchRuns } from "../lib/api/endpoints/run";

const HistoryPage = () => {
  const [runs, setRuns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);

  const updateRunPlans = async () => {
    setIsLoading(true);

    const runsRes = await fetchRuns({ workspaceId: currentWorkspace.id });

    setRuns(runsRes);

    setIsLoading(false);
  };

  useEffect(() => {
    updateRunPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace]);

  return (
    <>
      <PageTitle title="History" />
      <Row>
        <Col span={24}>
          <RunListTable
            isLoading={isLoading}
            runs={runs}
            refetch={updateRunPlans}
          />
        </Col>
      </Row>
    </>
  );
};

export default HistoryPage;
