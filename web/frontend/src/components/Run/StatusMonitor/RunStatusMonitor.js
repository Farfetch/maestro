import { useEffect, useState } from "react";

import { fetchRunById } from "../../../lib/api/endpoints/run";

const RunStatusStepsMonitor = ({ runId, children }) => {
  const [isIntervalLoading, setIsIntervalLoading] = useState(false);
  const [run, setRun] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateRunInterval = 5000;

  const updateRunData = async (runIdToUpdate) => {
    setIsIntervalLoading(true);
    const runData = await fetchRunById(runIdToUpdate);

    setRun(runData);
    setIsIntervalLoading(false);
  };

  // The function is executed only first time to make page load
  const loadRunData = async (runIdToLoad) => {
    const runData = await fetchRunById(runIdToLoad);

    setRun(runData);
    setIsLoading(false);
  };

  // Monitors runStatus to give real-time montoring about running test
  useEffect(() => {
    const interval = setInterval(() => {
      // Checks is there any request that is made to API that should be finished before
      if (!isIntervalLoading) updateRunData(runId);
    }, updateRunInterval);

    return () => clearInterval(interval);
  }, [runId, isIntervalLoading]);

  useEffect(() => {
    loadRunData(runId);
  }, [runId]);

  return children({ isLoading, run });
};

export default RunStatusStepsMonitor;
