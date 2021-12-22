import { Form } from "antd";

import AgentsSelect from "../../../../form/select/AgentsSelect";

const AvailableAgents = ({ agents }) => (
  <>
    <Form.Item
      label="Client Agent"
      name="clientAgentId"
      rules={[{ required: true, message: "Please select client Agent!" }]}
    >
      <AgentsSelect mode="single" agents={agents} />
    </Form.Item>
    <Form.Item
      label="Server Agents"
      name="serverAgentIds"
      rules={[
        {
          required: true,
          message: "Please select at least one server agent!"
        }
      ]}
    >
      <AgentsSelect mode="multiple" agents={agents} />
    </Form.Item>
  </>
);

export default AvailableAgents;
