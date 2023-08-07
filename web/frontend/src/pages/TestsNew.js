/* eslint-disable max-statements */
import { Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";

import PageSpinner from "../components/layout/PageSpinner";
import RunConfigurationForm from "../components/RunConfiguration/Form";
import {
  uploadNewCustomData,
  uploadNewRunPlan
} from "../components/RunConfiguration/Form/handlers";
import { CurrentWorkspaceContext } from "../context/CurrentWorkspace";
import { fetchAgents } from "../lib/api/endpoints/agent";
import { customDataDownloadUrl, runPlanDownloadUrl } from "../lib/routes";

const TestsNewPage = () => {
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);
  const [testFormInitialValues, setTestFormInitialValues] = useState({});
  const [agents, setAgents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [data, setRenderImportData] = useState(false);

  const getCustomData = async (customDataFiles) => {
    const customData = await Promise.all(
      customDataFiles.map(async (customDataFile) => {
        const newCustomDataFile = await uploadNewCustomData(customDataFile);
        return newCustomDataFile;
      })
    );
    return customData;
  };

  const parseJsonDataTestConfiguration = async (jsonData) => {
    setLoading(true);

    setTestFormInitialValues({
      title: jsonData.title,
      labels: jsonData.labels,
      agentIds: [],
      hosts: jsonData.hosts,
      customProperties: jsonData.custom_properties,
      loadProfile: jsonData.load_profile,
      isLoadProfileEnabled: jsonData.is_load_profile_enabled,
      workspace_id: currentWorkspace.id
    });

    const runPlanPromise = await uploadNewRunPlan(jsonData.run_plan);
    const customDataPromise = getCustomData(jsonData.custom_data_files);
    const [runPlan, customData] = await Promise.all([
      runPlanPromise,
      customDataPromise
    ]);

    setTestFormInitialValues((prevState) => ({
      ...prevState,
      runPlans:
        runPlan !== {}
          ? [
              {
                uid: runPlan.id,
                name: runPlan.title,
                status: "done",
                url: runPlanDownloadUrl(runPlan.id)
              }
            ]
          : {},
      customData:
        customData !== []
          ? customData.map((customDataItem) => ({
              uid: customDataItem.id,
              name: customDataItem.name,
              status: "done",
              url: customDataDownloadUrl(customDataItem.id)
            }))
          : []
    }));
    setRenderImportData(true);
    setLoading(false);
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const parseJsonData = JSON.parse(event.target.result);
      parseJsonDataTestConfiguration(parseJsonData);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const updateAgentsList = async () => {
    setLoading(true);
    const agentsRes = await fetchAgents({
      agent_status: "DISABLED"
    });
    setAgents(agentsRes);
    setLoading(false);
  };

  useEffect(() => {
    updateAgentsList();
  }, []);

  return (
    <>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Row justify="end" gutter={[16, 16]}></Row>
      )}
      {data ? (
        <Col span={24}>
          <RunConfigurationForm
            handleFileSelection={handleFileSelection}
            key={JSON.stringify(testFormInitialValues)}
            initialValues={testFormInitialValues}
            agents={agents}
          />
        </Col>
      ) : (
        <Col span={24}>
          <RunConfigurationForm
            agents={agents}
            handleFileSelection={handleFileSelection}
          />
        </Col>
      )}
    </>
  );
};

export default TestsNewPage;
