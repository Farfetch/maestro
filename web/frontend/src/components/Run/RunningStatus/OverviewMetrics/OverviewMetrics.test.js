import { render } from "@testing-library/react";
import React from "react";

import OverviewMetrics from "./OverviewMetrics";

describe("OverviewMetrics", () => {
  const mockRun = {
    id: "123",
    runStatus: "RUNNING"
  };

  test("should render OverviewMetrics component", () => {
    const rendered = render(<OverviewMetrics run={mockRun} />);
    const component = rendered.container;
    expect(component.outerHTML).toMatchSnapshot();
  });
});
