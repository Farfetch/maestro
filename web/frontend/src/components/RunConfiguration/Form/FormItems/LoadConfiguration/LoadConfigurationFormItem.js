import { Col, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import LoadConfigurationChart from "./LoadConfigurationChart";
import LoadConfigurationForm from "./LoadConfigurationForm";

const LoadConfiguration = ({ initialLoadProfile }) => {
  const [loadConfigurationData, setLoadConfigurationData] = useState([]);

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
      <Row gutter={[32, 32]} justify="start" align="middle">
        <Col span={24}>
          <LoadConfigurationChart data={loadConfigurationData} />
        </Col>
        <Col span={24}>
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
