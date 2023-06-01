import { Col, Form, Row, Space, Switch } from "antd";
import { useCallback, useEffect, useState } from "react";

import LoadConfigurationChart from "./LoadConfigurationChart";
import LoadConfigurationForm from "./LoadConfigurationForm";

const LoadConfiguration = ({
  initialLoadProfile,
  initialLoadProfileEnabled
}) => {
  const [loadConfigurationData, setLoadConfigurationData] =
    useState(initialLoadProfile);
  const [isLoadProfileRequired, setIsLoadProfileEnabled] = useState(null);

  useEffect(() => {
    setIsLoadProfileEnabled(initialLoadProfileEnabled);
  }, [initialLoadProfileEnabled]);

  const onInputChange = useCallback(
    (index, name, newValue) => {
      const currentValues = [...loadConfigurationData];
      if (!currentValues[index]) {
        currentValues[index] = {
          start: 0,
          end: 0,
          duration: 0
        };
      }
      currentValues[index][name] = newValue;

      setLoadConfigurationData(currentValues);
    },
    [loadConfigurationData, setLoadConfigurationData]
  );

  const onFieldRemove = useCallback(
    (indexToRemove) => {
      const currentValues = loadConfigurationData.filter(
        (item, index) => index !== indexToRemove
      );
      setLoadConfigurationData(currentValues);
    },
    [loadConfigurationData, setLoadConfigurationData]
  );

  useEffect(() => {
    setLoadConfigurationData(initialLoadProfile);
  }, [initialLoadProfile]);

  return (
    <>
      <Space style={{ marginBottom: "10px" }}>
        <Form.Item valuePropName="checked" name="isLoadProfileEnabled" noStyle>
          <Switch onChange={(value) => setIsLoadProfileEnabled(value)} />
        </Form.Item>
        <span>Enable Load Profiler</span>
      </Space>
      <Row gutter={[32, 32]} justify="start" align="middle">
        <Col span={24} hidden={!isLoadProfileRequired}>
          <LoadConfigurationChart data={loadConfigurationData} />
        </Col>
        <Col span={24} hidden={!isLoadProfileRequired}>
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
