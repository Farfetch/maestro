import { createContext, useContext, useEffect, useState } from "react";

import { fetchRuns } from "../../lib/api/endpoints/run";
import { runStatus } from "../../lib/api/models";
import { CurrentWorkspaceContext } from "../CurrentWorkspace";

export const RunningContext = createContext(null);

export const RunningContextProvider = ({ children }) => {
  const [runs, setRuns] = useState(null);
  const { currentWorkspace } = useContext(CurrentWorkspaceContext);

  const updateRunsInterval = 3000;

  // Monitors runsStatus to give real-time montoring about runsning test
  useEffect(() => {
    const updateRunsData = async () => {
      const runsData = await fetchRuns({
        workspaceId: currentWorkspace.id,
        run_status: runStatus.RUNNING
      });

      setRuns(runsData);
    };

    const interval = setInterval(() => {
      updateRunsData();
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
