import { useContext, useEffect, useState } from "react";

import { CurrentWorkspaceContext } from "../../../context/CurrentWorkspace";
import { fetchRuns } from "../../../lib/api/endpoints/run";
import { runStatus as runStatusModel } from "../../../lib/api/models";

const RunsMonitor = ({ children }) => {
  const [isIntervalLoading, setIsIntervalLoading] = useState(false);
  const [runs, setRuns] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);

  const updateRunsInterval = 5000;

  const fetchAvailableRuns = async () => {
    const availableRunStatuses = [
      runStatusModel.CREATING,
      runStatusModel.PENDING,
      runStatusModel.RUNNING
    ];

    const runsData = await fetchRuns({ workspaceId: currentWorkspace.id });
    const runningStatusRuns = runsData.filter((run) =>
      availableRunStatuses.includes(run.runStatus)
    );

    return runningStatusRuns;
  };

  // Monitors runsStatus to give real-time montoring about runsning test
  useEffect(() => {
    const updateRunsData = async () => {
      setIsIntervalLoading(true);

      const runsData = await fetchAvailableRuns();

      setRuns(runsData);
      setIsIntervalLoading(false);
    };

    const interval = setInterval(() => {
      // Checks is there any request that is made to API that should be finished before
      if (!isIntervalLoading) updateRunsData();
    }, updateRunsInterval);

    return () => clearInterval(interval);
  }, [isIntervalLoading, currentWorkspace]);

  // The function is executed only first time to make page load
  useEffect(() => {
    const loadRunsData = async () => {
      const runsData = await fetchAvailableRuns();
      setRuns(runsData);
      setIsLoading(false);
    };

    loadRunsData();
  }, []);

  return children({ isLoading, runs });
};

export default RunsMonitor;
