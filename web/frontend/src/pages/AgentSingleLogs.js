/* eslint-disable max-statements */
import { Col, DatePicker, Row, Space } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AgentsLogsTable from "../components/Agents/LogsTable";
import AgentLogLevelsSelect from "../components/form/select/AgentLogLevelsSelect";
import PageTitle from "../components/layout/PageTitle";
import { fetchAgents } from "../lib/api/endpoints/agent";
import { fetchAgentLogs } from "../lib/api/endpoints/agentLog";
import { agentLogLevel as agentLogLevelModel } from "../lib/api/models";

const AgentSingleLogs = () => {
  const { agentId } = useParams();
  const [agentLogs, setAgentLogs] = useState([]);
  const [agent, setAgent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const defaultDate = moment().startOf("day");
  const [selectedLogLevel, setSelectedLogLevel] = useState(
    agentLogLevelModel.DEBUG
  );
  const [selectedDateFrom, setSelectedDateFrom] = useState(defaultDate);

  const reloadAgentLogs = async (params, agentData) => {
    setIsLoading(true);
    const agentLogsRes = await fetchAgentLogs(params);
    const agentLogsWithHost = agentLogsRes.map((agentLog) => ({
      ...agentLog,
      hostname: agentData.hostname
    }));

    setIsLoading(false);
    setAgentLogs(agentLogsWithHost);
  };

  const reloadAgentsList = async (reloadAgentId) => {
    const agents = await fetchAgents();
    const pageAgent = agents.find(({ id }) => id === reloadAgentId);

    setAgent(pageAgent);
  };

  useEffect(() => {
    reloadAgentsList(agentId);
  }, [agentId]);

  useEffect(() => {
    if (agent !== null) {
      reloadAgentLogs(
        {
          dateFrom: selectedDateFrom,
          level: selectedLogLevel,
          agentIds: [agent.id]
        },
        agent
      );
    }
  }, [selectedDateFrom, selectedLogLevel, agent]);

  return (
    <Row gutter={[32, 32]} justify="start" align="middle">
      <Col flex="auto">
        <PageTitle title={"Agent Logs"} />
      </Col>
      <Col span={24}>
        <Space size="middle" align="left">
          <Space size="small" align="left" direction="vertical">
            From
            <DatePicker
              defaultValue={defaultDate}
              onChange={(changedDateFrom) =>
                setSelectedDateFrom(changedDateFrom)
              }
              showTime
            />
          </Space>
          <Space size="small" align="left" direction="vertical">
            Level
            <div style={{ width: "200px" }}>
              <AgentLogLevelsSelect
                onChange={(changedLogLevel) =>
                  setSelectedLogLevel(changedLogLevel)
                }
                mode={"single"}
              />
            </div>
          </Space>
        </Space>
      </Col>
      <Col span={24}>
        <AgentsLogsTable agentLogs={agentLogs} isLoading={isLoading} />
      </Col>
    </Row>
  );
};

export default AgentSingleLogs;
