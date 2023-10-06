import { render } from "@testing-library/react";
import React from "react";

import RunSummaryTable from "./RunSummaryTable";

describe("RunSummaryTable", () => {
  const mockMetrics = [
    {
      label: "Label 1",
      latencyP50: 50,
      latencyP99: 60,
      totalCount: 100,
      successCount: 90,
      errorsCount: 10,
      errorRate: 10,
      rpm: 200,
      responses: [
        { responseCode: "200", messages: ["Success message 1"] },
        { responseCode: "400", messages: ["Error message 1"] }
      ]
    }
  ];

  const mockTotals = {
    totalLatencyP50: 55,
    totalLatencyP99: 65,
    totalCount: 200,
    totalSuccessCount: 180,
    totalErrorsCount: 20,
    totalErrorsRate: 10,
    totalRpm: 400
  };

  test("should render RunSummaryTable component", () => {
    const rendered = render(
      <RunSummaryTable
        metrics={mockMetrics}
        isLoading={false}
        totals={mockTotals}
        setLabelToShowGraph={() => {}}
        setActiveTabKey={() => {}}
      />
    );

    const component = rendered.container;
    expect(component.outerHTML).toMatchSnapshot();
  });
});
