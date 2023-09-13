import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";

import { runLogDownloadUrl } from "../../../../lib/routes";

const MoreButtonsMenu = ({ runId }) => {
  const items = [
    {
      key: "runId",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={runLogDownloadUrl(runId)}
        >
          Download logs
        </a>
      )
    }
  ];

  return (
    <Dropdown key="more" menu={{ items }} placement="bottomRight">
      <Button type="text" icon={<MoreOutlined style={{ fontSize: 20 }} />} />
    </Dropdown>
  );
};

export default MoreButtonsMenu;
