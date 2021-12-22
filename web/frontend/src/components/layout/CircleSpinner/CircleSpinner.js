import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const CircleSpinner = ({ size = 32 }) => (
  <Spin indicator={<LoadingOutlined style={{ fontSize: size }} spin />} />
);

export default CircleSpinner;
