import { render } from "@testing-library/react";
import React from "react";

import AgentStatusBadge from "./AgentStatusBadge";

describe("components/AgentStatusBadge", () => {
  [
    "CREATING",
    "AVAILABLE",
    "PROCESSING_EVENT",
    "RUNNING_TEST",
    "UNAVAILABLE"
  ].map((agentStatus) =>
    test(`should render ${agentStatus} badge`, async () => {
      const rendered = render(
        <AgentStatusBadge agentStatus={agentStatus} text={agentStatus} />
      );

      const badgeComponent = rendered.container;
      expect(badgeComponent.outerHTML).toMatchSnapshot();
    })
  );
});
