import { Form } from "antd";

import AgentsSelect from "../../../../form/select/AgentsSelect";

const AvailableAgents = ({ agents }) => (
  <>
    <Form.Item
      label="Agents"
      name="agentIds"
      rules={[
        {
          required: true,
          message: "Please select at least one agent!"
        }
      ]}
    >
      <AgentsSelect mode="multiple" agents={agents} />
    </Form.Item>
  </>
);

export default AvailableAgents;
