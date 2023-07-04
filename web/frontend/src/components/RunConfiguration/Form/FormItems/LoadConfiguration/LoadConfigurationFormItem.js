import { Col, Form, Row, Space, Switch } from "antd";
import { useCallback, useEffect, useState } from "react";

import ClearButton from "./ClearButton";
import LoadConfigurationChart from "./LoadConfigurationChart";
import LoadConfigurationForm from "./LoadConfigurationForm";
import PasteButton from "./PasteButton";

const LoadConfiguration = ({
  initialLoadProfile,
  initialLoadProfileEnabled,
  onChange
}) => {
  const [loadConfigurationData, updateVariables] = useState({
    charData: initialLoadProfile,
    isLoadProfileRequired: initialLoadProfileEnabled,
    clipboardText: ""
  });

  const onInputChange = useCallback(
    (index, name, newValue) => {
      const currentValues = [...loadConfigurationData.charData];
      if (!currentValues[index]) {
        currentValues[index] = {
          start: 0,
          end: 0,
          duration: 0
        };
      }
      currentValues[index][name] = newValue;

      updateVariables((prevState) => ({
        ...prevState,
        charData: currentValues
      }));
    },
    [loadConfigurationData.charData]
  );

  const onFieldRemove = useCallback(
    (indexToRemove) => {
      const currentValues = loadConfigurationData.charData.filter(
        (item, index) => index !== indexToRemove
      );
      updateVariables((prevState) => ({
        ...prevState,
        charData: currentValues
      }));
    },
    [loadConfigurationData.charData]
  );

  const handlePaste = (text) => {
    updateVariables((prevState) => ({ ...prevState, clipboardText: text }));
  };

  const handleClear = () => {
    updateVariables((prevState) => ({ ...prevState, clipboardText: "." }));
  };

  useEffect(() => {
    if (loadConfigurationData.clipboardText !== "") {
      const cleanText = loadConfigurationData.clipboardText
        .trim()
        .replaceAll("line(", "")
        .replaceAll("s)", "")
        .replaceAll("\t\t", "");
      let lines = cleanText.split(" ");
      lines = lines.map((el) => {
        const [start, end, duration] = el.split(",").map(Number);
        if (
          Number.isNaN(start) ||
          Number.isNaN(end) ||
          Number.isNaN(duration) ||
          start === undefined ||
          end === undefined ||
          duration === undefined
        ) {
          return null;
        }
        return { start, end, duration };
      });
      lines = lines.filter((el) => el !== null);
      updateVariables((prevState) => ({
        ...prevState,
        charData: lines,
        clipboardText: ""
      }));
      onChange(lines);
    }
  }, [onChange, loadConfigurationData.clipboardText]);

  const handleLoadProfileEnabled = (value) => {
    updateVariables((prevState) => ({
      ...prevState,
      isLoadProfileRequired: value
    }));
  };

  return (
    <>
      <Row justify="space-between">
        <Space style={{ marginBottom: "20px" }}>
          <Form.Item
            valuePropName="checked"
            name="isLoadProfileEnabled"
            noStyle
          >
            <Switch
              onChange={(value) => {
                handleLoadProfileEnabled(value);
              }}
            />
          </Form.Item>
          <span>Enable Load Profiler</span>
        </Space>
        <Row hidden={!loadConfigurationData.isLoadProfileRequired}>
          <ClearButton handleClear={handleClear} />
          <PasteButton handlePaste={handlePaste} />
        </Row>
      </Row>
      <Row gutter={[32, 32]} justify="start" align="middle">
        <Col span={24} hidden={!loadConfigurationData.isLoadProfileRequired}>
          <LoadConfigurationChart data={loadConfigurationData.charData} />
        </Col>
        <Col span={24} hidden={!loadConfigurationData.isLoadProfileRequired}>
          <LoadConfigurationForm
            onInputChange={onInputChange}
            onFieldRemove={onFieldRemove}
          />
        </Col>
      </Row>
    </>
  );
};

export default LoadConfiguration;
