import { createContext, useContext, useEffect, useState } from "react";

import { fetchRuns } from "../../lib/api/endpoints/run";
import { runStatus as runStatusModel } from "../../lib/api/models";
import { CurrentWorkspaceContext } from "../CurrentWorkspace";

export const RunningContext = createContext(null);

export const RunningContextProvider = ({ children }) => {
  const [runs, setRuns] = useState(null);
  const [currentlyRunning, setCurrentRuns] = useState(null);
  const [isIntervalLoading, setIsIntervalLoading] = useState(false);
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);

  const updateRunsInterval = 3000;

  // Monitors runsStatus to give real-time montoring about runsning test
  useEffect(() => {
    const updateRunsData = async () => {
      setIsIntervalLoading(true);
      const availableRunStatuses = [
        runStatusModel.CREATING,
        runStatusModel.PENDING,
        runStatusModel.RUNNING
      ];

      const runsData = await fetchRuns({ workspaceId: currentWorkspace.id });
      const availableRuns = runsData.filter((run) =>
        availableRunStatuses.includes(run.runStatus)
      );
      const currentRunningRuns = runsData.filter(
        (run) => run.runStatus === runStatusModel.RUNNING
      );

      setRuns(availableRuns);
      setCurrentRuns(currentRunningRuns);
      setIsIntervalLoading(false);
    };

    const interval = setInterval(() => {
      if (!isIntervalLoading) updateRunsData();
    }, updateRunsInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace]);

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (currentlyRunning && currentlyRunning.length > 0) {
      link.href = "/runningTests.ico";
    } else {
      link.href = "/favicon.ico";
    }
  }, [currentlyRunning]);

  return (
    <RunningContext.Provider value={{ runs }}>
      {children}
    </RunningContext.Provider>
  );
};
