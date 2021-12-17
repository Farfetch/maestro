import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import PageTitle from "../components/layout/PageTitle";
import RunConfigurationTable from "../components/RunConfiguration/Table";
import { fetchRunConfigurations } from "../lib/api/endpoints/runConfiguration";

const TestsPage = () => {
  const [runConfigurations, setRunConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateRunConfigurations = async () => {
    setIsLoading(true);

    const runConfigurationsRes = await fetchRunConfigurations();

    setRunConfigurations(runConfigurationsRes);

    setIsLoading(false);
  };

  useEffect(() => {
    updateRunConfigurations();
  }, []);

  return (
    <>
      <PageTitle
        title={"Tests"}
        button={{ link: "/tests/new", title: "Create" }}
      />
      <Row>
        <Col span={24}>
          <RunConfigurationTable
            isLoading={isLoading}
            runConfigurations={runConfigurations}
          />
        </Col>
      </Row>
    </>
  );
};

export default TestsPage;
