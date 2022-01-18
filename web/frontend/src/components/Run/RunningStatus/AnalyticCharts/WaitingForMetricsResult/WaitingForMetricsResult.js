import { Result, Statistic } from "antd";

import CircleSpinner from "../../../../layout/CircleSpinner";
import Timer from "../../../../Timer";
import StopExecutionButton from "../../StopExecutionButton";

const WaitingForMetricsResult = ({ run }) => (
  <Result
    icon={<CircleSpinner size={48} />}
    title="Almost there! Metrics will be available in a minute"
    subTitle={
      <>
        Test is already started and running. Usualy is takes takes 1-2 minutes,
        please wait...
        <Timer startTime={run.startedAt} defaultTime={run.startedAt}>
          {(time, loading) => (
            <Statistic title="" value={time} loading={loading} />
          )}
        </Timer>
      </>
    }
    extra={[<StopExecutionButton runId={run.id} key="stopExecution" />]}
  />
);

export default WaitingForMetricsResult;
