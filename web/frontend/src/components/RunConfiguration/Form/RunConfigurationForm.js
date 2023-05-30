/* eslint-disable max-statements */
/* eslint-disable max-lines */
import { Button, Card, Col, Form, message, Row, Typography } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CurrentWorkspaceContext } from "../../../context/CurrentWorkspace";
import { createRun, startRun } from "../../../lib/api/endpoints/run";
import { colors } from "../../../lib/colors";
import { toUtcHourMinute } from "../../../lib/date";
import AvailableAgentsFormItem from "./FormItems/AvailableAgents";
import CustomDataFormItem from "./FormItems/CustomData";
import LoadConfigurationFormItem from "./FormItems/LoadConfiguration";
import RunCustomPropertiesFormItem from "./FormItems/RunCustomProperties";
import RunHostsFormItem from "./FormItems/RunHosts";
import RunPlanFormItem from "./FormItems/RunPlan";
import ScheduleFormItem from "./FormItems/Schedule";
import TitleFormItem from "./FormItems/Title";
import {
  isAgentsStatusValid,
  saveRunConfiguration,
  uploadCustomData,
  uploadRunPlan
} from "./handlers";

const { Title, Text } = Typography;

const RunConfigurationForm = ({
  runConfigurationId,
  initialValues,
  agents
}) => {
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);
  const [isClone, setIsClone] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async ({
    title,
    labels,
    agentIds,
    hosts,
    customProperties,
    customData,
    runPlans,
    loadProfile,
    isScheduleEnabled,
    scheduleDays,
    scheduleTime,
    isLoadProfileEnabled
  }) => {
    const loadingMessageKey = "runConfigurationFormLoading";

    message.loading({ content: "Loading...", key: loadingMessageKey });
    // TODO: error handling
    // Need to add handling when something goes with files upload and we can't continue creating test

    // it returns list from the component but we have limitation to upload 1 file.
    // The list cannot be bigger than one item
    const runPlanId = await uploadRunPlan(runPlans[0]);
    const customDataIds = await uploadCustomData(customData || []);

    const dataToSave = {
      title,
      labels,
      runPlanId,
      agentIds,
      hosts,
      customDataIds,
      customProperties,
      loadProfile,
      isScheduleEnabled,
      workspaceId: currentWorkspace.id,
      isLoadProfileEnabled
    };

    if (isScheduleEnabled) {
      dataToSave.schedule = {
        days: scheduleDays,
        time: toUtcHourMinute(scheduleTime)
      };
    }

    const newRunConfigurationId = await saveRunConfiguration(
      !isClone ? runConfigurationId : null,
      dataToSave
    );

    message.success({ content: "Saved!", key: loadingMessageKey });

    // Redirect to RunConfiguration single page once configuration is created
    if (newRunConfigurationId !== runConfigurationId)
      navigate(`/test/${newRunConfigurationId}`);
  };

  const startTest = async () => {
    const agentIds = form.getFieldValue("agentIds");
    const agentsValid = isAgentsStatusValid(agents, agentIds);
    if (agentsValid) {
      const { id: runId } = await createRun(runConfigurationId);
      await startRun(runId);
      navigate(`/run/${runId}`);
    } else {
      message.error({
        content:
          "Can't start a test! Selected agents are not available, check your agents status and try again.",
        duration: 4
      });
    }
  };

  const onFinishFailed = async () => {};

  const FormBlock = ({ left, right }) => (
    <Col span={24}>
      <Card>
        <Row align="top" gutter={[48, 0]}>
          <Col span={8}>{left}</Col>
          <Col span={16}>{right}</Col>
        </Row>
      </Card>
    </Col>
  );

  const FormBlockText = ({ children }) => (
    <Text style={{ color: colors.grey[3] }}>{children}</Text>
  );

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="basic"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[0, 16]}>
          <FormBlock
            left={
              <>
                <Title level={5}>General</Title>
                <FormBlockText style={{ color: colors.grey[3] }}>
                  Fields would be copied to all new started tests. Use this
                  block as short test identification to quickly understand
                  difference between running tests.
                </FormBlockText>
              </>
            }
            right={<TitleFormItem />}
          />

          <FormBlock
            left={
              <>
                <Title level={5}>Agents</Title>
                <FormBlockText>
                  Select where you want to execute tests. You can choosee
                  multiple agents based on load configuration and how powerfull
                  machines are. The configuration would be replicated to each
                  selected agent.
                </FormBlockText>
              </>
            }
            right={<AvailableAgentsFormItem agents={agents} />}
          />

          <FormBlock
            left={
              <>
                <Title level={5}>Schedule</Title>
                <FormBlockText>
                  Select days and time when you want to run your tests on daily
                  basics.
                </FormBlockText>
              </>
            }
            right={
              <ScheduleFormItem
                initialScheduleEnabled={initialValues.isScheduleEnabled}
              />
            }
          />

          <FormBlock
            left={
              <>
                <Title level={5}>Test Plan</Title>
                <FormBlockText>
                  Select JMeter JMX script. The script will be copied to all
                  agents and executed from there.
                </FormBlockText>
              </>
            }
            right={<RunPlanFormItem />}
          />

          <FormBlock
            left={
              <>
                <Title level={5}>Custom Data</Title>
                <FormBlockText>
                  Select CSV files that your test uses. The data will be
                  accessable from each agent and easily can be used inside Test
                  Plan.
                </FormBlockText>
              </>
            }
            right={<CustomDataFormItem />}
          />

          <FormBlock
            left={
              <>
                <Title level={5}>Hosts Override</Title>
                <FormBlockText>
                  Setup DNS hosts that should be overriden in order to execute
                  tests against internal endpoints.
                </FormBlockText>
              </>
            }
            right={<RunHostsFormItem />}
          />

          <FormBlock
            left={
              <>
                <Title level={5}>Custom Properties</Title>
                <FormBlockText>
                  Custom properties will be overriden for all agents and also
                  available as JMeter properties inside JMeter Test Plan.
                </FormBlockText>
              </>
            }
            right={<RunCustomPropertiesFormItem />}
          />

          <FormBlock
            left={
              <>
                <Title level={5}>Load Profiler</Title>
                <FormBlockText>
                  Load configuration is visualised and configured per each
                  agent. By using and configuring load in this section you also
                  will see the predicted vs real throughput during test
                  executuion.
                </FormBlockText>
              </>
            }
            right={
              <LoadConfigurationFormItem
                initialLoadProfile={initialValues.loadProfile}
                initialLoadProfileEnabled={initialValues.isLoadProfileEnabled}
              />
            }
          />
        </Row>
        <Row justify="end" gutter={[8, 8]} style={{ marginTop: "20px" }}>
          <Col>
            <Button
              type="link"
              size="large"
              key="submit"
              onClick={() => startTest()}
            >
              Start
            </Button>
          </Col>
          <Col>
            <Button
              type="dashed"
              size="large"
              key="submit"
              onClick={() => {
                setIsClone(true);
                form.submit();
              }}
            >
              Clone
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              key="submit"
              onClick={() => form.submit()}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

RunConfigurationForm.defaultProps = {
  runConfigurationId: null,
  initialValues: {
    agentIds: [],
    runPlans: [],
    customData: [],
    hosts: [],
    customProperties: [],
    loadProfile: [],
    isScheduleEnabled: false,
    scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    scheduleTime: moment("09:00", "HH:mm"),
    isLoadProfileEnabled: true
  },
  agents: []
};

RunConfigurationForm.propTypes = {
  runConfigurationId: PropTypes.string,
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    agentIds: PropTypes.arrayOf(PropTypes.string),
    hosts: PropTypes.arrayOf(
      PropTypes.shape({
        host: PropTypes.string.isRequired,
        ip: PropTypes.string.isRequired
      })
    ),
    customProperties: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ),
    runPlans: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      })
    ),
    customData: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      })
    ),
    loadProfile: PropTypes.any.isRequired
  }).isRequired,
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      agentStatus: PropTypes.string.isRequired,
      hostname: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  ).isRequired
};

export default RunConfigurationForm;
