import { InboxOutlined } from "@ant-design/icons";
import { Typography, Upload } from "antd";
import PropTypes from "prop-types";

const UploadDragger = ({
  name,
  fileList,
  description,
  multiple,
  beforeUpload,
  onChange,
  maxCount = 0
}) => (
  <>
    <Upload.Dragger
      name={name}
      beforeUpload={beforeUpload}
      multiple={multiple}
      style={{
        marginBottom: "0"
      }}
      fileList={fileList}
      onChange={onChange}
      maxCount={maxCount}
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

UploadDragger.defaultProps = {
  multiple: false,
  fileList: [],
  beforeUpload: () => false,
  onChange: () => {},
  maxCount: 0
};

UploadDragger.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  maxCount: PropTypes.number.isRequired,
  beforeUpload: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default UploadDragger;
