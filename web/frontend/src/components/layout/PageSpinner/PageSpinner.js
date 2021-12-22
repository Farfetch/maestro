import { Row } from "antd";

import CircleSpinner from "../CircleSpinner";

const PageSpinner = () => (
  <Row align="middle" justify="center" style={{ alignSelf: "center" }}>
    <CircleSpinner size={64} />
  </Row>
);

export default PageSpinner;
