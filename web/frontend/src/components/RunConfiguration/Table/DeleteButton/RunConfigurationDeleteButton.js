import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm } from "antd";
import PropTypes from "prop-types";

import { deleteRunConfiguration } from "../../../../lib/api/endpoints/runConfiguration";

const RunConfigurationDeleteButton = ({ runConfigurationId, refetch }) => (
  <Popconfirm
    key="restart"
    placement="left"
    title={
      <>
        <p>Are you sure you want to delete Test?</p>
        <p>
          You cannot undone this action and all runs and metris would be lost.
        </p>
      </>
    }
    okText="Yes"
    cancelText="No"
    onConfirm={async () => {
      await deleteRunConfiguration(runConfigurationId);
      refetch();
      message.success({
        content: "Deleted!",
        key: `deleteTest_${runConfigurationId}`
      });
    }}
  >
    <Button type="link" danger icon={<DeleteOutlined />}>
      Delete
    </Button>
  </Popconfirm>
);

RunConfigurationDeleteButton.propTypes = {
  runConfigurationId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired
};

export default RunConfigurationDeleteButton;
