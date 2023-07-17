import { Collapse, Descriptions, Table } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { fetchAgentById } from "../../../../lib/api/endpoints/agent";
import { fetchCustomDataById } from "../../../../lib/api/endpoints/customData";
import { fetchRunConfigurationById } from "../../../../lib/api/endpoints/runConfiguration";
import { fetchRunPlanById } from "../../../../lib/api/endpoints/runPlan";
import {
  customDataDownloadUrl,
  runPlanDownloadUrl
} from "../../../../lib/routes";
import PageSpinner from "../../../layout/PageSpinner";
import LoadConfigurationChart from "../../../RunConfiguration/Form/FormItems/LoadConfiguration/LoadConfigurationChart";

const { Panel } = Collapse;

const InitialConfiguration = ({ run }) => {
  const [isLoading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);
  const defaultActivePanels = [
    "agents",
    "files",
    "hosts",
    "custom",
    "loadProfiler"
  ];

  const fetchTestConfiguration = async (runConfigurationIdParam) => {
    setLoading(true);
    const {
      agentIds,
      runPlanId,
      customDataIds,
      hosts,
      customProperties,
      loadProfile,
      isLoadProfileEnabled
    } = await fetchRunConfigurationById(runConfigurationIdParam);

    const customData = await Promise.all(
      customDataIds.map(fetchCustomDataById)
    );
    const runPlan = await fetchRunPlanById(runPlanId);

    const agentsNames = await Promise.all(agentIds.map(fetchAgentById));

    setInitialValues({
      agentIds,
      agentsNames: agentsNames.map((agent) => ({
        id: agent.id,
        ip: agent.ip,
        name: agent.hostname
      })),
      hosts,
      customProperties,
      loadProfile,
      isLoadProfileEnabled,
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
    fetchTestConfiguration(run.runConfigurationId);
  }, [run.runConfigurationId]);

  return (
    <>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Collapse defaultActiveKey={defaultActivePanels}>
          <Panel header="Agents" key="agents">
            <Descriptions column={2} bordered>
              <Descriptions.Item
                label="N. of Agents"
                key="numberOfAgents"
                span={2}
                style={{ width: "50%", textAlign: "center" }}
              >
                {initialValues?.agentIds.length}
              </Descriptions.Item>
              <Descriptions.Item
                label="Agent Names"
                key="agentNames"
                span={2}
                style={{ width: "50%", textAlign: "center" }}
              >
                {initialValues?.agentsNames.map((agent, index) => (
                  <div key={index}>{agent.name}</div>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Panel>

          <Panel header="Files" key="files">
            <Descriptions column={2} bordered>
              <Descriptions.Item
                label="Test Plan"
                key="testPlan"
                span={2}
                style={{ width: "50%", textAlign: "center" }}
              >
                <a href={initialValues?.runPlans[0]?.url}>
                  {initialValues?.runPlans[0]?.name}
                </a>
              </Descriptions.Item>
              <Descriptions.Item
                label="Custom Data"
                key="customData"
                span={2}
                style={{ width: "50%", textAlign: "center" }}
              >
                {initialValues?.customData?.map((customElement, index) => (
                  <div key={index}>
                    <a href={customElement.url}>{customElement.name}</a>
                  </div>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Panel>

          <Panel header="Hosts" key="hosts">
            <Table
              dataSource={initialValues?.hosts.map((host, index) => ({
                ...host,
                key: index
              }))}
              columns={[
                {
                  title: "Host",
                  dataIndex: "host",
                  key: "host",
                  width: "50%",
                  align: "center"
                },
                {
                  title: "IP",
                  dataIndex: "ip",
                  key: "ip",
                  width: "50%",
                  align: "center"
                }
              ]}
              pagination={false}
            />
          </Panel>

          <Panel header="Custom Properties" key="custom">
            <Table
              dataSource={initialValues?.customProperties.map(
                (customProp, index) => ({ ...customProp, key: index })
              )}
              columns={[
                {
                  title: "Property",
                  dataIndex: "name",
                  key: "name",
                  width: "50%",
                  align: "center"
                },
                {
                  title: "Value",
                  dataIndex: "value",
                  key: "value",
                  width: "50%",
                  align: "center"
                }
              ]}
              pagination={false}
            />
          </Panel>

          <Panel header="Load Profiler" key="loadProfiler">
            <div style={{ textAlign: "center" }}>
              {initialValues?.isLoadProfileEnabled ? (
                <div
                  style={{
                    height: "300px",
                    width: "600px",
                    display: "inline-block"
                  }}
                >
                  <LoadConfigurationChart data={initialValues.loadProfile} />
                </div>
              ) : (
                <p> Load Profiler was disabled. </p>
              )}
            </div>
          </Panel>
        </Collapse>
      )}
    </>
  );
};

InitialConfiguration.propTypes = {
  run: PropTypes.shape({
    agentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    hosts: PropTypes.arrayOf(
      PropTypes.shape({
        host: PropTypes.string.isRequired,
        ip: PropTypes.string.isRequired
      })
    ).isRequired,
    customProperties: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    // runPlans: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     uid: PropTypes.string.isRequired,
    //     name: PropTypes.string.isRequired,
    //     status: PropTypes.string.isRequired,
    //     url: PropTypes.string.isRequired
    //   })
    // ).isRequired,
    // customData: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     uid: PropTypes.string.isRequired,
    //     name: PropTypes.string.isRequired,
    //     status: PropTypes.string.isRequired,
    //     url: PropTypes.string.isRequired
    //   })
    // ).isRequired,
    loadProfile: PropTypes.any.isRequired
  }).isRequired
};

export default InitialConfiguration;
