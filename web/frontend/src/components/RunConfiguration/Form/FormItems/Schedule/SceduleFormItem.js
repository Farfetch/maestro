import { Col, Form, Row, Select, Space, Switch, TimePicker } from "antd";
import { useEffect, useState } from "react";

const TitleFormItem = ({ initialScheduleEnabled }) => {
  const [isDaysTimeDisabled, setIsDaysTimeDisabled] = useState(null);

  useEffect(() => {
    setIsDaysTimeDisabled(!initialScheduleEnabled);
  }, [initialScheduleEnabled]);

  return (
    <>
      <Space style={{ marginBottom: "10px" }}>
        <Form.Item valuePropName="checked" name="isScheduleEnabled" noStyle>
          <Switch onChange={(value) => setIsDaysTimeDisabled(!value)} />
        </Form.Item>
        <span>Enable running schedule</span>
      </Space>

      <Row gutter={[12, 0]}>
        <Col span={12}>
          <Form.Item
            label="Days:"
            name="scheduleDays"
            rules={
              isDaysTimeDisabled
                ? []
                : [
                    {
                      required: true,
                      message: "Please select at least one day!"
                    }
                  ]
            }
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Select days"
              disabled={isDaysTimeDisabled}
            >
              <Select.Option key="Mon">Mon</Select.Option>
              <Select.Option key="Tue">Tue</Select.Option>
              <Select.Option key="Wed">Wed</Select.Option>
              <Select.Option key="Thu">Thu</Select.Option>
              <Select.Option key="Fri">Fri</Select.Option>
              <Select.Option key="Sat">Sat</Select.Option>
              <Select.Option key="Sun">Sun</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Time:"
            name="scheduleTime"
            rules={
              isDaysTimeDisabled
                ? []
                : [
                    {
                      required: true,
                      message: "Please select time to run!"
                    }
                  ]
            }
          >
            <TimePicker
              minuteStep={5}
              format="HH:mm"
              style={{ width: "100%" }}
              disabled={isDaysTimeDisabled}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default TitleFormItem;
