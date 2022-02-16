import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, message, Tag, Tooltip } from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

import { updateRun } from "../../../../lib/api/endpoints/run";

const RunEditableLabelsGroup = ({ runId, defaultValue = [] }) => {
  const [labels, setLabels] = useState(defaultValue);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const input = useRef(null);

  const updateRunLabels = async (labelsToUpdate) => {
    await updateRun(runId, {
      labels: labelsToUpdate
    });
    message.success({ content: "Saved!" });
  };
  const handleClose = async (removedTag) => {
    const newLabels = labels.filter((tag) => tag !== removedTag);

    setLabels(newLabels);
    await updateRunLabels(newLabels);
  };

  const handleInputConfirm = async () => {
    if (inputValue && labels.indexOf(inputValue) === -1) {
      const newLabels = [...labels, inputValue];
      setLabels(newLabels);
      await updateRunLabels(newLabels);
    }

    setInputVisible(false);
    setInputValue("");
  };

  useEffect(() => {
    if (inputVisible) {
      input.current.focus();
    }
  }, [inputVisible]);

  useEffect(() => {}, [labels]);

  return (
    <>
      {labels.map((tag) => {
        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag key={tag} closable={true} onClose={() => handleClose(tag)}>
            <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={input}
          type="text"
          size="small"
          style={{ width: "160px" }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setInputVisible(true)}
        >
          New label
        </Button>
      )}
    </>
  );
};

RunEditableLabelsGroup.propTypes = {
  runId: PropTypes.string.isRequired,
  defaultValue: PropTypes.arrayOf(PropTypes.string)
};

export default RunEditableLabelsGroup;
