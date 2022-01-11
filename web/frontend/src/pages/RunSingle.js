import React from "react";
import { useParams } from "react-router-dom";

import PageSpinner from "../components/layout/PageSpinner";
// import RunErrorStatus from "../components/Run/ErrorStatus";
import RunPendingStatus from "../components/Run/PendingStatus";
import RunRunningStatus from "../components/Run/RunningStatus";
import RunStatusMonitor from "../components/Run/StatusMonitor";
import { runStatus as runStatusModel } from "../lib/api/models";
import { toUtcString } from "../lib/date";

const getRunSinglePageByStatus = (run) => {
  switch (run.runStatus) {
    case runStatusModel.PENDING:
    case runStatusModel.CREATING:
      // TODO: add ERROR status for run model
      return <RunPendingStatus run={run} />;
    // return <RunErrorStatus run={run} />;
    default:
      return <RunRunningStatus runId={run.id} run={run} />;
  }
};

// Page would be rendered only if run.updatedAt changed
const PageContainer = React.memo(
  ({ run }) => getRunSinglePageByStatus(run),
  (prevProps, nextProps) =>
    toUtcString(prevProps.run.updatedAt) ===
    toUtcString(nextProps.run.updatedAt)
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
