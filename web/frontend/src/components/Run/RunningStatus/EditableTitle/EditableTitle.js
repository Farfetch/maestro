import { message, Typography } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

import { updateRun } from "../../../../lib/api/endpoints/run";

const { Paragraph } = Typography;
const EditableTitle = ({ runId, currentTitle = "" }) => {
  const [value, setValue] = useState(null);

  const onChange = async (newValue) => {
    setValue(newValue);

    await updateRun(runId, { title: newValue });

    message.success({ content: "Saved!" });
  };

  return (
    <div style={{ width: "550px" }}>
      <Paragraph
        editable={{
          onChange
        }}
        style={{
          paddingLeft: "14px",
          maxWidth: "500px",
          paddingTop: "18px"
        }}
        type="primary"
        ellipsis
      >
        {value || currentTitle}
      </Paragraph>
    </div>
  );
};

EditableTitle.propTypes = {
  runId: PropTypes.string.isRequired,
  currentTitle: PropTypes.string.isRequired
};

export default EditableTitle;
