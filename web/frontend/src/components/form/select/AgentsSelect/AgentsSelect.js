import { Select } from "antd";
import { orderBy } from "lodash";
import PropTypes from "prop-types";

import { agentStatus } from "../../../../lib/api/models";
import AgentStatusBadge from "../../../badge/AgentStatusBadge";

const { Option } = Select;

const AgentsSelect = ({ value, agents, mode, onChange }) => (
  <Select
    mode={mode}
    allowClear
    showSearch
    filterOption={(input, option) => {
      const optionText = option.children.props.text.toLowerCase();
      const inputValue = input.toLowerCase();
      return optionText.includes(inputValue);
    }}
    optionFilterProp="children.props.text"
    style={{ width: "100%" }}
    placeholder="Select Agent from the list"
    onChange={onChange}
    value={value}
  >
    {orderBy(agents, "hostname", "asc").map((agent) => (
      <Option key={agent.id} value={agent.id}>
        <AgentStatusBadge
          agentStatus={agent.agentStatus}
          text={agent.hostname}
        />
      </Option>
    ))}
  </Select>
);

AgentsSelect.defaultProps = {
  onChange: () => {},
  mode: "single",
  value: ""
};

AgentsSelect.propTypes = {
  mode: PropTypes.oneOf(["single", "multiple"]).isRequired,
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      agentStatus: PropTypes.oneOf(Object.values(agentStatus)),
      hostname: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired
};

export default AgentsSelect;
