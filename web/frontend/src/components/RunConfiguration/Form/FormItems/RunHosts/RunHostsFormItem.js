import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";

const RunHostsFormItem = () => (
  <>
    <Form.List name="hosts">
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Row key={field.key} align="middle" gutter={[6, 0]}>
              <Col flex="auto">
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Form.Item
                      {...field}
                      label="Host"
                      name={[field.name, "host"]}
                      fieldKey={[field.fieldKey, "host"]}
                      rules={[{ required: true, message: "Missing host" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...field}
                      label="IP"
                      name={[field.name, "ip"]}
                      fieldKey={[field.fieldKey, "ip"]}
                      rules={[{ required: true, message: "Missing IP" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col flex="20px" style={{ margin: "30px 0 24px 0" }}>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Col>
            </Row>
          ))}

          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            Add custom host
          </Button>
        </>
      )}
    </Form.List>
  </>
);

export default RunHostsFormItem;
