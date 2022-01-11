import { Col, Progress, Space, Typography } from "antd";

import { runAgentStatus as runAgentStatusModel } from "../../../../lib/api/models";
import CircleSpinner from "../../../layout/CircleSpinner";
import RunAgentsStatusMonitor from "./RunAgentsStatusMonitor";

const RunPendingStatusAgentsList = ({ runId }) => {
  const isAgentRunningStatus = (runAgentStatus) =>
    runAgentStatusModel.PROCESSING === runAgentStatus ||
    runAgentStatusModel.RUNNING === runAgentStatus;

  const isAgentFinishedStatus = (runAgentStatus) =>
    runAgentStatusModel.FINISHED === runAgentStatus;

  const isAgentErrorStatus = (runAgentStatus) =>
    runAgentStatusModel.ERROR === runAgentStatus;

  return (
    <RunAgentsStatusMonitor runId={runId}>
      {({ isLoading, runAgents }) =>
        isLoading ? (
          <CircleSpinner />
        ) : (
          // React.Memo can be used to optimise the performance (ex. src/pages/RunSingle.js )
          // Since the page is used only before test is started a there is no hudge child components
          // Worth to consider benefits from using React.Memo
          runAgents.map(({ id, agentHostname, agentStatus }) => (
            <Col span={24} key={`agent-${id}`}>
              <Space size="middle">
                {isAgentRunningStatus(agentStatus) ? (
                  <CircleSpinner size={20} />
                ) : null}
                {isAgentFinishedStatus(agentStatus) ? (
                  <Progress type="circle" percent={100} width={20} />
                ) : null}
                {isAgentErrorStatus(agentStatus) ? (
                  <Progress
                    type="circle"
                    status="exception"
                    percent={100}
                    width={20}
                  />
                ) : null}

                <Typography.Text strong={true}>{agentHostname}</Typography.Text>
              </Space>
            </Col>
          ))
        )
      }
    </RunAgentsStatusMonitor>
  );
};

export default RunPendingStatusAgentsList;
