import { Col, Row, Typography } from "antd";
import PropTypes from "prop-types";

const { Title } = Typography;

const PageTitleRow = ({ title, button = null }) => (
  <Row style={{ marginBottom: "1rem" }}>
    <Col flex="auto">
      <Title style={{ marginBottom: "0" }}>{title}</Title>
    </Col>
    {button ? (
      <Col
        flex="100px"
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "right"
        }}
      >
        {button}
      </Col>
    ) : null}
  </Row>
);

PageTitleRow.propTypes = {
  title: PropTypes.string.isRequired,
  button: PropTypes.any
};

export default PageTitleRow;
