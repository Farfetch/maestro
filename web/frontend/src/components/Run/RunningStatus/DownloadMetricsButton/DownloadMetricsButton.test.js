import { render } from "@testing-library/react";
import React from "react";

import DownloadMetricsButton from "./DownloadMetricsButton";

describe("components/Run/RunningStatus/DownloadMetricsButton", () => {
  test(`should render DownloadMetricsButton component`, async () => {
    const rendered = render(<DownloadMetricsButton runId="1-2-3" />);

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
