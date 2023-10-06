import { render } from "@testing-library/react";
import React from "react";

import OverviewMetrics from "./OverviewMetrics";

describe("OverviewMetrics", () => {
  const mockMetrics = [
    {
      key: "metric1",
      errorsCount: 5,
      successCount: 20,
      errorRate: 25,
      label: "Label 1",
      rpm: 50,
      totalCount: 25,
      latencyAvg: 50,
      latencyP50: 45,
      latencyP90: 60,
      latencyP99: 75,
      responses: [{ responseCode: "200" }, { responseCode: "404" }]
    },
    {
      key: "metric2",
      errorsCount: 3,
      successCount: 15,
      errorRate: 20,
      label: "Label 2",
      rpm: 60,
      totalCount: 18,
      latencyAvg: 55,
      latencyP50: 50,
      latencyP90: 65,
      latencyP99: 80,
      responses: [{ responseCode: "200" }, { responseCode: "500" }]
    }
  ];

  const mockTotals = {
    totalLatencyAvg: 105,
    totalLatencyP50: 95,
    totalLatencyP90: 125,
    totalLatencyP99: 155,
    totalSuccessCount: 35,
    totalErrorsCount: 8,
    totalErrorsRate: 22.86,
    totalCount: 43,
    totalRpm: 110
  };

  test("should render OverviewMetrics component", () => {
    const rendered = render(
      <OverviewMetrics
        metrics={mockMetrics}
        totals={mockTotals}
        isLoading={false}
      />
    );
    const component = rendered.container;
    expect(component.outerHTML).toMatchSnapshot();
  });
});
