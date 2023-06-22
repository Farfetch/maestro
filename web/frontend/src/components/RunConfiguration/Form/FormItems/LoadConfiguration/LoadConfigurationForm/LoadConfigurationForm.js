import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, InputNumber, Row } from "antd";

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 26 },
  gutter: 0
};

const LoadConfigurationForm = ({ onInputChange, onFieldRemove }) => (
  <>
    <Form.List name="loadProfile">
      {(fields, { add, remove }) => (
        <>
          {fields.length > 0 ? (
            <Row gutter={[8, 0]}>
              <Col flex="auto">
                <Row gutter={[24, 0]}>
                  <Col span={8}>Start RPS</Col>
                  <Col span={8}>End RPS</Col>
                  <Col span={8}>Duration</Col>
                </Row>
              </Col>
              <Col flex="20px"></Col>
            </Row>
          ) : null}
          {fields.map((field, index) => (
            <Row key={field.key} align="middle" gutter={[6, 0]}>
              <Col flex="auto">
                <Row gutter={[16, 0]}>
                  <Col span={8}>
                    <Form.Item
                      {...field}
                      name={[field.name, "start"]}
                      rules={[{ required: true, message: "Missing Start RPS" }]}
                      {...formItemLayout}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        onChange={(value) =>
                          onInputChange(index, "start", value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...field}
                      name={[field.name, "end"]}
                      rules={[{ required: true, message: "Missing End RPS" }]}
                      {...formItemLayout}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        onChange={(value) => onInputChange(index, "end", value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...field}
                      name={[field.name, "duration"]}
                      rules={[{ required: true, message: "Missing Duration" }]}
                      {...formItemLayout}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        onChange={(value) =>
                          onInputChange(index, "duration", value)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col flex="20px" style={{ margin: "0 0 24px 0" }}>
                <MinusCircleOutlined
                  onClick={() => {
                    onFieldRemove(field.name);
                    remove(field.name);
                  }}
                />
              </Col>
            </Row>
          ))}

          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            Add step
          </Button>
        </>
      )}
    </Form.List>
  </>
);

export default LoadConfigurationForm;
