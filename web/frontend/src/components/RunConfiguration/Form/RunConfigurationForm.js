import { Button, Card, Col, Form, message, Row, Typography } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { createRun, startRun } from "../../../lib/api/endpoints/run";
import { colors } from "../../../lib/colors";
import AvailableAgentsFormItem from "./FormItems/AvailableAgents";
import CustomDataFormItem from "./FormItems/CustomData";
import LoadConfigurationFormItem from "./FormItems/LoadConfiguration";
import RunCustomPropertiesFormItem from "./FormItems/RunCustomProperties";
import RunHostsFormItem from "./FormItems/RunHosts";
import RunPlanFormItem from "./FormItems/RunPlan";
import TitleFormItem from "./FormItems/Title";
import {
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
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async ({
    title,
    clientAgentId,
    serverAgentIds,
    hosts,
    customProperties,
    customData,
    runPlans,
    loadProfile
  }) => {
    const loadingMessageKey = "runConfigurationFormLoading";

    message.loading({ content: "Loading...", key: loadingMessageKey });
    // TODO: error handling
    // Need to add handling when something goes with files upload and we can't continue creating test

    // it returns list from the component but we have limitation to upload 1 file.
    // The list cannot be bigger than one item
    const runPlanId = await uploadRunPlan(runPlans[0]);
    const customDataIds = await uploadCustomData(customData || []);

    const newRunConfigurationId = await saveRunConfiguration(
      runConfigurationId,
      {
        title,
        runPlanId,
        clientAgentId,
        serverAgentIds,
        hosts,
        customDataIds,
        customProperties,
        loadProfile
      }
    );

    message.success({ content: "Saved!", key: loadingMessageKey });

    // Redirect to RunConfiguration single page once configuration is created
    if (newRunConfigurationId !== runConfigurationId)
      navigate(`/test/${newRunConfigurationId}`);
  };

  const startTest = async () => {
    const { id: runId } = await createRun(runConfigurationId);
    await startRun(runId);

    navigate(`/run/${runId}`);
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
                  Test title would be copied to all new started tests. Use this
                  field as short test identification to be able quckly
                  understand difference between running tests.
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
                  multiple server agents based on load configuration and how
                  powerfull machines are.
                </FormBlockText>
              </>
            }
            right={<AvailableAgentsFormItem agents={agents} />}
          />

          <FormBlock
            left={
              <>
                <Title level={5}>Test Plan</Title>
                <FormBlockText>
                  Select Jmeter JMX script. The script will be copied to all
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
                  available as Jmeter properties inside Jmeter Test Plan.
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
    serverAgentIds: [],
    runPlans: [],
    customData: [],
    hosts: [],
    customProperties: [],
    loadProfile: []
  },
  agents: []
};

RunConfigurationForm.propTypes = {
  runConfigurationId: PropTypes.string,
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    clientAgentId: PropTypes.string,
    serverAgentIds: PropTypes.arrayOf(PropTypes.string),
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
