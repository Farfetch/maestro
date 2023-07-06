import { createContext, useContext, useEffect, useState } from "react";

import { fetchRuns } from "../../lib/api/endpoints/run";
import { CurrentWorkspaceContext } from "../CurrentWorkspace";

export const RunningContext = createContext(null);

export const RunningContextProvider = ({ children }) => {
  const [runs, setRuns] = useState(null);
  const [isIntervalLoading, setIsIntervalLoading] = useState(false);
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);

  const updateRunsInterval = 15000;

  // Monitors runsStatus to give real-time montoring about runsning test
  useEffect(() => {
    const updateRunsData = async () => {
      setIsIntervalLoading(true);
      const availableRunStatuses = ["CREATING", "PENDING", "RUNNING"];

      const availableRuns = await fetchRuns({
        workspaceId: currentWorkspace?.id,
        run_status: availableRunStatuses
      });

      setRuns(availableRuns);
      setIsIntervalLoading(false);
    };

    if (currentWorkspace) {
      updateRunsData();
    }

    const interval = setInterval(() => {
      if (!isIntervalLoading && currentWorkspace) {
        updateRunsData();
      }
    }, updateRunsInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace]);

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (runs && runs.length > 0) {
      link.href = "/runningTests.ico";
    } else {
      link.href = "/favicon.ico";
    }
  }, [runs]);

  return (
    <RunningContext.Provider value={{ runs }}>
      {children}
    </RunningContext.Provider>
  );
};
