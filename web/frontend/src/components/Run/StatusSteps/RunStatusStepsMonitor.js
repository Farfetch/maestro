import React, { useEffect, useState } from "react";

import { fetchRunById } from "../../../lib/api/endpoints/run";
import { runStatus } from "../../../lib/api/models";
import PageSpinner from "../../layout/PageSpinner";
import RunStatusSteps from "./RunStatusSteps";

const RunStatusStepsMonitor = ({ runId }) => {
  const [run, setRun] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIntervalLoading, setIsIntervalLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const updateRunInterval = 5000;

  const calculateCurrentStep = (currentRun) => {
    switch (currentRun.runStatus) {
      case runStatus.CREATING:
        return 0;
      case runStatus.PENDING:
        return 1;
      case runStatus.RUNNING:
        return 2;
      case runStatus.STOPPED:
      case runStatus.FINISHED:
        return 3;

      default:
        throw new Error(
          `${currentRun.runStatus} test running status step is not defined`
        );
    }
  };

  useEffect(() => {
    const updateRun = async () => {
      setIsLoading(true);

      const runData = await fetchRunById(runId);

      setRun(runData);
      setCurrentStep(calculateCurrentStep(runData));

      setIsLoading(false);
    };

    updateRun();
  }, [runId]);

  // Monitors runStatus to give real-time montoring about running test
  useEffect(() => {
    const refreshRunProgress = async () => {
      setIsIntervalLoading(true);
      const runData = await fetchRunById(runId);

      const newCurrentStep = calculateCurrentStep(runData);

      if (newCurrentStep !== currentStep) {
        setRun(runData);
        setCurrentStep(newCurrentStep);
      }

      setIsIntervalLoading(false);
    };

    const interval = setInterval(() => {
      // Checks is there any request that is made to API that should be finished before
      if ((!isLoading, !isIntervalLoading)) refreshRunProgress();
    }, updateRunInterval);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isIntervalLoading]);

  return isLoading ? (
    <PageSpinner />
  ) : (
    <RunStatusSteps run={run} currentStep={currentStep} />
  );
};

export default RunStatusStepsMonitor;
