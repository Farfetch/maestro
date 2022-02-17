import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageSpinner from "../components/layout/PageSpinner";
import RunConfigurationForm from "../components/RunConfiguration/Form";
import { fetchAgents } from "../lib/api/endpoints/agent";
import { fetchCustomDataById } from "../lib/api/endpoints/customData";
import { fetchRunConfigurationById } from "../lib/api/endpoints/runConfiguration";
import { fetchRunPlanById } from "../lib/api/endpoints/runPlan";
import { customDataDownloadUrl, runPlanDownloadUrl } from "../lib/routes";

const CreateTestPage = () => {
  const { runConfigurationId } = useParams();
  const [testFormItialValues, setTestFormItialValues] = useState(null);
  const [agents, setAgents] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchTestConfiguration = async (runConfigurationIdParam) => {
    setLoading(true);
    const {
      title,
      labels,
      clientAgentId,
      serverAgentIds,
      runPlanId,
      customDataIds,
      hosts,
      customProperties,
      loadProfile
    } = await fetchRunConfigurationById(runConfigurationIdParam);

    const customData = await Promise.all(
      customDataIds.map(fetchCustomDataById)
    );
    const runPlan = await fetchRunPlanById(runPlanId);

    const agentsRes = await fetchAgents();
    setAgents(agentsRes);

    setTestFormItialValues({
      title,
      labels,
      clientAgentId,
      serverAgentIds,
      hosts,
      customProperties,
      loadProfile,
      runPlans: [
        {
          uid: runPlan.id,
          name: runPlan.title,
          status: "done",
          url: runPlanDownloadUrl(runPlan.id)
        }
      ],
      customData: customData.map((customDataItem) => ({
        uid: customDataItem.id,
        name: customDataItem.name,
        status: "done",
        url: customDataDownloadUrl(customDataItem.id)
      }))
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchTestConfiguration(runConfigurationId);
  }, [runConfigurationId]);

  return (
    <>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Row>
          <Col span={24}>
            <RunConfigurationForm
              runConfigurationId={runConfigurationId}
              initialValues={testFormItialValues}
              agents={agents}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default CreateTestPage;
