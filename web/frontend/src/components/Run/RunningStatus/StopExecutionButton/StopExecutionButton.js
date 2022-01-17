import { Button, Popconfirm } from "antd";
import { useCallback } from "react";

import { stopRun } from "../../../../lib/api/endpoints/run";

const StopExecutionButton = ({ runId }) => {
  const onStop = useCallback(() => {
    stopRun(runId);
  }, [runId]);

  return (
    <Popconfirm
      placement="left"
      key="restart"
      title={
        <>
          <p>Are you sure you want to stop the test?</p>
          <p>You will not be able to resume the test.</p>
        </>
      }
      okText="Yes"
      cancelText="No"
      onConfirm={onStop}
    >
      <Button key="stop" type="primary" danger={true}>
        Stop Execution
      </Button>
    </Popconfirm>
  );
};

export default StopExecutionButton;
