import { render } from "@testing-library/react";
import moment from "moment";
import React from "react";

import AgentsSelect from "./AgentsSelect";

describe("components/form/select/AgentsSelect", () => {
  const agents = [
    {
      id: "agent-id",
      hostname: "agent-hostname",
      ip: "test-ip",
      agentStatus: "AVAILABLE",
      createdAt: moment("2018-05-24T13:48:04.313000"),
      updatedAt: moment("2018-05-24T13:48:04.313000")
    },
    {
      id: "agent-id2",
      hostname: "agent-hostname2",
      ip: "test-ip2",
      agentStatus: "PROCESSING_EVENT",
      createdAt: moment("2018-05-24T13:48:04.313000"),
      updatedAt: moment("2018-05-24T13:48:04.313000")
    }
  ];
  test(`should render AgentsSelect component with mode=single`, async () => {
    const rendered = render(<AgentsSelect agents={agents} mode="single" />);

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
  test(`should render AgentsSelect component with mode=multiple`, async () => {
    const rendered = render(
      <AgentsSelect agents={agents} mode="multiple" value={[]} />
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
