import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";

const RunCustomPropertiesFormItem = () => (
  <>
    <Form.List name="customProperties">
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Row key={field.key} align="middle" gutter={[6, 0]}>
              <Col flex="auto">
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Form.Item
                      {...field}
                      label="Property"
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      rules={[
                        { required: true, message: "Missing property name" }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...field}
                      label="Value"
                      name={[field.name, "value"]}
                      fieldKey={[field.fieldKey, "value"]}
                      rules={[{ required: true, message: "Missing Value" }]}
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
            Add custom property
          </Button>
        </>
      )}
    </Form.List>
  </>
);

export default RunCustomPropertiesFormItem;
