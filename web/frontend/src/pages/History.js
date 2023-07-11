/* eslint-disable max-statements */
import { ReloadOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageTitle from "../components/layout/PageTitle";
import RunListTable from "../components/Run/ListTable";
import SearchBar from "../components/SearchBar";
import { CurrentWorkspaceContext } from "../context/CurrentWorkspace";
import { fetchRuns } from "../lib/api/endpoints/run";
import { historyUrl } from "../lib/routes";

const HistoryPage = () => {
  const [runs, setRuns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewRunConfigurationId, setViewRunConfigurationIds] = useState(false);
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);
  const [searchRunTile, setSearchRunTile] = useState("");
  const { runConfigurationId } = useParams();

  const updateRunPlans = async () => {
    setIsLoading(true);

    const runsRes = await fetchRuns({
      workspaceId: currentWorkspace.id,
      title: searchRunTile,
      run_configuration_id: runConfigurationId
    });

    setViewRunConfigurationIds(!!runConfigurationId && !searchRunTile);

    setRuns(runsRes);

    setIsLoading(false);
  };

  useEffect(() => {
    updateRunPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace, searchRunTile]);

  useEffect(() => {
    setSearchRunTile("");
    updateRunPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runConfigurationId]);

  const filterSearchRunTitle = (value) => {
    setSearchRunTile(value);
  };

  return (
    <>
      <PageTitle title="History" />
      <SearchBar
        onChangeSearchRunTitle={filterSearchRunTitle}
        placeholder={
          viewRunConfigurationId
            ? runConfigurationId
            : "Search for Run Title or ID"
        }
      />
      <Link to={historyUrl}>
        <Button
          hidden={!viewRunConfigurationId}
          style={{ marginLeft: "8px" }}
          icon={<ReloadOutlined />}
        >
          Reset
        </Button>
      </Link>
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
