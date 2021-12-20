import { Col, Row, Typography } from "antd";
import React from "react";

import RunConfigurationForm from "../components/RunConfiguration/Form";

const { Title } = Typography;

const TestsNewPage = () => (
  <>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={2}>Test Configuration</Title>
      </Col>
      <Col span={24}>
        <RunConfigurationForm />
      </Col>
    </Row>
  </>
);

export default TestsNewPage;
