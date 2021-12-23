import { Button, Col, Row, Steps, Typography } from "antd";
import React, { useState } from "react";

import { stopRun } from "../../../lib/api/endpoints/run";
import { runStatus } from "../../../lib/api/models";

const { Step } = Steps;
const { Title } = Typography;

const RunningSteps = ({ run, currentStep }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onStopTestClick = async () => {
    setIsLoading(true);
    await stopRun(run.id);
    setIsLoading(false);
  };

  return (
    <>
      <Row gutter={[0, 24]}>
        <Col flex="auto">
          <Title level={3}>{run.title}</Title>
        </Col>
        <Col
          flex="100px"
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "right"
          }}
        >
          <Button
            type="primary"
            size="large"
            danger
            loading={isLoading}
            disabled={
              isLoading ||
              run.runStatus === runStatus.FINISHED ||
              run.runStatus === runStatus.STOPPED
            }
            onClick={onStopTestClick}
          >
            Stop test
          </Button>
        </Col>

        <Col span={24}>
          <Steps progressDot current={currentStep}>
            <Step
              title="Creating"
              description={
                currentStep === 0
                  ? "Creating unique identifier for Run along with all needed resources."
                  : ""
              }
            />
            <Step
              title="Pending"
              description={
                currentStep === 1 ? "Waiting for agents to start a test" : "" // TODO: add agents hosts
              }
            />
            <Step
              title="Running"
              // TODO: add time about test running time and info about running
            />
            <Step
              title="Finished"
              description="" // TODO: add more info and links about tests results
            />
          </Steps>
        </Col>
      </Row>
    </>
  );
};

export default RunningSteps;
