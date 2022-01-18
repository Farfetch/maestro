import { render } from "@testing-library/react";
import React from "react";

import RunStatusTag from "./RunStatusTag";

describe("components/RunStatusTag", () => {
  ["CREATING", "PENDING", "RUNNING", "STOPPED", "FINISHED", "ERROR"].map(
    (runStatus) =>
      test(`should render ${runStatus} badge`, async () => {
        const rendered = render(<RunStatusTag runStatus={runStatus} />);

        const badgeComponent = rendered.container;
        expect(badgeComponent.outerHTML).toMatchSnapshot();
      })
  );
});
