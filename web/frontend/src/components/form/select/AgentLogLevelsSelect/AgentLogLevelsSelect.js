import { Select } from "antd";
import PropTypes from "prop-types";

import { agentLogLevel } from "../../../../lib/api/models";

const AgentLogLevelsSelect = ({ onChange = () => {}, mode = "single" }) => (
  <Select
    mode={mode}
    allowClear
    placeholder="Select Log level"
    onChange={onChange}
    style={{ width: "100%" }}
    defaultValue={agentLogLevel.DEBUG}
  >
    {Object.values(agentLogLevel).map((logLevel) => (
      <Select.Option key={logLevel}>{logLevel}</Select.Option>
    ))}
  </Select>
);

AgentLogLevelsSelect.propTypes = {
  mode: PropTypes.oneOf(["single", "multiple"]).isRequired
};

export default AgentLogLevelsSelect;
