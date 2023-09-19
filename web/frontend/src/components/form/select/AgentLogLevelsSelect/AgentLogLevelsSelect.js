import { Button, Select } from "antd";
import React, { useState } from "react";

import { agentLogLevel } from "../../../../lib/api/models";

const AgentLogLevelsSelect = ({ onChange = () => {} }) => {
  const [selectedLevels, setSelectedLevels] = useState([]);

  const handleSelectAll = () => {
    const allLevels = Object.values(agentLogLevel);
    setSelectedLevels(allLevels);
    onChange(allLevels);
  };

  const handleUnselectAll = () => {
    setSelectedLevels([]);
    onChange([]);
  };

  const handleChange = (selected) => {
    setSelectedLevels(selected);
    onChange(selected);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Select
        mode={"multiple"}
        allowClear
        placeholder="Select Log level"
        onChange={handleChange}
        style={{ width: "100%" }}
        defaultValue={agentLogLevel.DEBUG}
        value={selectedLevels}
      >
        {Object.values(agentLogLevel).map((logLevel) => (
          <Select.Option key={logLevel}>{logLevel}</Select.Option>
        ))}
      </Select>
      <Button
        type="primary"
        onClick={handleSelectAll}
        style={{ marginLeft: "10px" }}
      >
        Select All
      </Button>
      <Button
        type="danger"
        onClick={handleUnselectAll}
        style={{ marginLeft: "10px" }}
      >
        Unselect All
      </Button>
    </div>
  );
};

export default AgentLogLevelsSelect;
