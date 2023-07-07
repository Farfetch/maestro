/* eslint-disable max-statements */
/* eslint-disable max-lines */
import {
  CopyOutlined,
  DownloadOutlined,
  HistoryOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  UpCircleOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Form, message, Row, Typography } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CurrentWorkspaceContext } from "../../../context/CurrentWorkspace";
import { createRun, startRun } from "../../../lib/api/endpoints/run";
import { colors } from "../../../lib/colors";
import { toUtcHourMinute } from "../../../lib/date";
import { RunConfigurationDownloadUrl, runsHistory } from "../../../lib/routes";
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
  handleFileSelection,
  runConfigurationId,
  initialValues,
  agents
}) => {
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);
  const [isClone, setIsClone] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  const onFinish = async ({
    title,
    labels,
    agentIds,
    hosts,
    customProperties,
    customData,
    runPlans,
    loadProfile,
    isLoadProfileEnabled,
    isScheduleEnabled,
    scheduleDays,
    scheduleTime
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

  const handleJumpToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <Row
          justify="space-between"
          align="middle"
          gutter={[8, 8]}
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <Title level={2}>Test Configuration</Title>
          <Col>
            <div style={{ display: "flex" }}>
              <div hidden={!runConfigurationId}>
                <Button
                  icon={<HistoryOutlined />}
                  href={runsHistory(runConfigurationId)}
                  size="large"
                >
                  View Past Runs
                </Button>
              </div>
              <div hidden={!runConfigurationId} style={{ marginLeft: "8px" }}>
                <Button
                  type="dashed"
                  size="large"
                  key="submit"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    setIsClone(true);
                    form.submit();
                  }}
                >
                  Clone
                </Button>
              </div>
              <div hidden={!runConfigurationId} style={{ marginLeft: "8px" }}>
                <Button
                  icon={<DownloadOutlined />}
                  href={RunConfigurationDownloadUrl(runConfigurationId)}
                  size="large"
                >
                  Export
                </Button>
              </div>
              <div hidden={runConfigurationId} style={{ marginLeft: "8px" }}>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={handleFileSelection}
                  ref={fileInputRef}
                />

                <Button
                  size="large"
                  icon={<UploadOutlined />}
                  onClick={() => fileInputRef.current.click()}
                >
                  Import
                </Button>
              </div>
              <div style={{ marginLeft: "8px" }}>
                <Button
                  size="large"
                  key="submit"
                  icon={<SaveOutlined />}
                  onClick={() => form.submit()}
                >
                  Save
                </Button>
              </div>
              <div style={{ marginLeft: "8px" }}>
                <Button
                  type="primary"
                  size="large"
                  key="submit"
                  icon={<PlayCircleOutlined />}
                  onClick={() => startTest()}
                >
                  Start
                </Button>
              </div>
            </div>
          </Col>
        </Row>
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
                  accessible from each agent and easily can be used inside Test
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
                  Setup DNS hosts that should be overridden in order to execute
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
                  Custom properties will be overridden for all agents and also
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
                  Load configuration is visualized and configured per each
                  agent. By using and configuring load in this section you also
                  will see the predicted vs real throughput during test
                  execution.
                </FormBlockText>
              </>
            }
            right={
              <LoadConfigurationFormItem
                initialLoadProfile={initialValues.loadProfile}
                initialLoadProfileEnabled={initialValues.isLoadProfileEnabled}
                onChange={(loadProfile) => form.setFieldsValue({ loadProfile })}
              />
            }
          />
        </Row>
        <Row justify="end">
          <div
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "10px"
            }}
          >
            <Button
              type="primary"
              size="large"
              icon={<UpCircleOutlined />}
              onClick={handleJumpToTop}
            >
              Jump to top
            </Button>
          </div>
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
