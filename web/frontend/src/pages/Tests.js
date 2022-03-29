/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageTitle from "../components/layout/PageTitle";
import RunConfigurationTable from "../components/RunConfiguration/Table";
import { CurrentWorkspaceContext } from "../context/CurrentWorkspace";
import { fetchRunConfigurations } from "../lib/api/endpoints/runConfiguration";
import { testNewUrl } from "../lib/routes";

const TestsPage = () => {
  const [runConfigurations, setRunConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);

  const updateRunConfigurations = async () => {
    setIsLoading(true);

    const runConfigurationsRes = await fetchRunConfigurations({
      workspaceId: currentWorkspace.id
    });

    setRunConfigurations(runConfigurationsRes);

    setIsLoading(false);
  };

  useEffect(() => {
    updateRunConfigurations();
  }, [currentWorkspace]);

  return (
    <>
      <PageTitle
        title={"Tests"}
        button={
          <Link to={testNewUrl}>
            <Button type="primary" size="large">
              Create
            </Button>
          </Link>
        }
      />
      <Row>
        <Col span={24}>
          <RunConfigurationTable
            isLoading={isLoading}
            runConfigurations={runConfigurations}
            refetch={updateRunConfigurations}
          />
        </Col>
      </Row>
    </>
  );
};

export default TestsPage;
