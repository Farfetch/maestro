import { CopyFilled } from "@ant-design/icons";
import { Button } from "antd";

function PasteButton({ handlePaste }) {
  const copyFromClipboard = async () => {
    const clipboardText = await navigator.clipboard.readText();

    handlePaste(clipboardText);
  };

  return (
    <div>
      <Button type="primary" icon={<CopyFilled />} onClick={copyFromClipboard}>
        Paste
      </Button>
    </div>
  );
}

export default PasteButton;
