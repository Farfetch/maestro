import { ClearOutlined } from "@ant-design/icons";
import { Button } from "antd";

function PasteButton({ handleClear }) {
  return (
    <div>
      <Button
        style={{ marginRight: "10px" }}
        icon={<ClearOutlined />}
        onClick={handleClear}
      >
        Clear
      </Button>
    </div>
  );
}

export default PasteButton;
