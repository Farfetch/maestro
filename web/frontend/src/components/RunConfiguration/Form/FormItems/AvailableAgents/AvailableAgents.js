import { Form } from "antd";
import { useEffect, useState } from "react";

import { fetchAgents } from "../../../../../lib/api/endpoints/agent";
import AgentsSelect from "../../../../form/select/AgentsSelect";

const AvailableAgents = () => {
  const [agents, setAgents] = useState([]);

  const updateAgentsList = async () => {
    const result = await fetchAgents();

    setAgents(result);
  };

  useEffect(() => {
    updateAgentsList();
  }, []);

  return (
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
            message: "Please select at least one of server agents!"
          }
        ]}
      >
        <AgentsSelect mode="multiple" agents={agents} />
      </Form.Item>
    </>
  );
};

export default AvailableAgents;
