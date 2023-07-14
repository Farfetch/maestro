import { render } from "@testing-library/react";
import React from "react";

import RunEndpointsChart from "./RunEndpointCharts";

describe("RunEndpointsChart", () => {
  const mockRun = {
    id: "123"
  };
  const mockLabelToShowGraph = "Label1";

  test("should render RunEndpointsChart component", () => {
    const rendered = render(
      <RunEndpointsChart
        run={mockRun}
        labelToShowGraph={mockLabelToShowGraph}
      />
    );

    const chartComponent = rendered.container;
    expect(chartComponent.outerHTML).toMatchSnapshot();
  });
});
