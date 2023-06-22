import { useContext, useEffect } from "react";

import { RunningContext } from "../../../context/Running";

const RunsMonitor = ({ children }) => {
  const { runs } = useContext(RunningContext);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch runs data from RunningContext.js
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isLoading = runs === null;

  return children({ isLoading, runs });
};

export default RunsMonitor;
