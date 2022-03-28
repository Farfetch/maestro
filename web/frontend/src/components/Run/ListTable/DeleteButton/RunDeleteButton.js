import { Button, message, Popconfirm } from "antd";
import PropTypes from "prop-types";

import { deleteRun } from "../../../../lib/api/endpoints/run";

const RunDeleteButton = ({ runId, refetch }) => (
  <Popconfirm
    key="restart"
    placement="left"
    title={
      <>
        <p>Are you sure you want to delete Run?</p>
        <p>You cannot undone this action and all metris would be lost.</p>
      </>
    }
    okText="Yes"
    cancelText="No"
    onConfirm={async () => {
      await deleteRun(runId);
      refetch();
      message.success({ content: "Deleted!", key: `deleteRun_${runId}` });
    }}
  >
    <Button type="link" danger>
      Delete
    </Button>
  </Popconfirm>
);

RunDeleteButton.propTypes = {
  runId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired
};

export default RunDeleteButton;
