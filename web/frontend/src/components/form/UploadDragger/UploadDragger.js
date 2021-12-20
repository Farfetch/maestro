import { InboxOutlined } from "@ant-design/icons";
import { Typography, Upload } from "antd";
import PropTypes from "prop-types";

const UploadDragger = ({
  name,
  description,
  multiple = false,
  beforeUpload = () => false
}) => (
  <>
    <Upload.Dragger
      name={name}
      beforeUpload={beforeUpload}
      multiple={multiple}
      style={{
        marginBottom: "0"
      }}
    >
      <div
        style={{
          display: "flex"
        }}
      >
        <div style={{ width: "60px" }}>
          <InboxOutlined
            style={{
              color: "#40a9ff",
              fontSize: "40px"
            }}
          />
        </div>
        <Typography.Text style={{ lineHeight: "40px" }}>
          {description}
        </Typography.Text>
      </div>
    </Upload.Dragger>
  </>
);

UploadDragger.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default UploadDragger;
