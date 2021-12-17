import { Button, Col, Row, Typography } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

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
        <Link to={button.link}>
          <Button type="primary" size="large">
            {button.title}
          </Button>
        </Link>
      </Col>
    ) : null}
  </Row>
);

PageTitleRow.propTypes = {
  title: PropTypes.string.isRequired,
  button: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  })
};

export default PageTitleRow;
