import { useEffect, useState } from "react";

import { fetchRunAgents } from "../../../../../lib/api/endpoints/runAgent";

/**
 * Component is responsible to update child component list of agents
 * There is one more similar stored in src/components/Run/StatusMonitor/RunStatusMonitor
 * to monitor the status of Run.
 * To make page more dynamic the agents status is checked each 2s
 */
const RunAgentsStatusMonitor = ({ runId, children }) => {
  const [isIntervalLoading, setIsIntervalLoading] = useState(false);
  const [runAgents, setRunAgents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateRunInterval = 2000;

  const updateAgentsData = async (runIdToUpdate) => {
    setIsIntervalLoading(true);
    const runAgentsData = await fetchRunAgents({ runId: runIdToUpdate });

    setRunAgents(runAgentsData);
    setIsIntervalLoading(false);
  };

  // The function is executed only first time to make page load
  const loadAgentsData = async (runIdToLoad) => {
    const runAgentsData = await fetchRunAgents({ runId: runIdToLoad });

    setRunAgents(runAgentsData);
    setIsLoading(false);
  };

  // Monitors runAgents status to give real-time montoring about running test
  // The function will be detached after navigation
  useEffect(() => {
    const interval = setInterval(() => {
      // Checks is there any request that is made to API that should be finished before
      if (!isIntervalLoading) updateAgentsData(runId);
    }, updateRunInterval);

    return () => clearInterval(interval);
  }, [runId, isIntervalLoading]);

  useEffect(() => {
    loadAgentsData(runId);
  }, [runId]);

  return children({ isLoading, runAgents });
};

export default RunAgentsStatusMonitor;
