import { message, Typography } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

import { updateRun } from "../../../../lib/api/endpoints/run";

const { Paragraph } = Typography;
const RunNotesInput = ({ runId, defaultValue = "" }) => {
  const [value, setValue] = useState(null);

  const onChange = async (newValue) => {
    setValue(newValue);

    await updateRun(runId, { notes: newValue });

    message.success({ content: "Saved!" });
  };

  return (
    <Paragraph editable={{ onChange }} type="secondary">
      {value || defaultValue}
    </Paragraph>
  );
};

RunNotesInput.propTypes = {
  runId: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired
};

export default RunNotesInput;
