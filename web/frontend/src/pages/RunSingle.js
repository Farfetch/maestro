import React from "react";
import { useParams } from "react-router-dom";

import PageSpinner from "../components/layout/PageSpinner";
import RunErrorStatus from "../components/Run/ErrorStatus";
import RunPendingStatus from "../components/Run/PendingStatus";
import RunRunningStatus from "../components/Run/RunningStatus";
import RunStatusMonitor from "../components/Run/StatusMonitor";
import { runStatus as runStatusModel } from "../lib/api/models";

const getRunSinglePageByStatus = (run) => {
  switch (run.runStatus) {
    case runStatusModel.PENDING:
    case runStatusModel.CREATING:
      return <RunPendingStatus run={run} />;
    case runStatusModel.ERROR:
      return <RunErrorStatus run={run} />;
    default:
      return <RunRunningStatus runId={run.id} run={run} />;
  }
};

// The whole page would be updated once run_status changed.
// There is no other field that would update the page, consider
// using update_at once we just need to update page if anything inside run changed
const PageContainer = React.memo(
  ({ run }) => getRunSinglePageByStatus(run),
  (prevProps, nextProps) =>
    prevProps.run.run_status === nextProps.run.run_status
);

const RunSinglePage = () => {
  const { runId } = useParams(null);

  return (
    <RunStatusMonitor runId={runId}>
      {({ isLoading, run }) =>
        isLoading ? <PageSpinner /> : <PageContainer run={run} />
      }
    </RunStatusMonitor>
  );
};

export default RunSinglePage;
