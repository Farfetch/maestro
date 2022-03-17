import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";

import { runLogDownloadUrl } from "../../../../lib/routes";

const MoreButtonsMenu = ({ runId }) => {
  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={runLogDownloadUrl(runId)}
        >
          Download logs
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown key="more" overlay={menu} placement="bottomRight">
      <Button type="text" icon={<MoreOutlined style={{ fontSize: 20 }} />} />
    </Dropdown>
  );
};

export default MoreButtonsMenu;
