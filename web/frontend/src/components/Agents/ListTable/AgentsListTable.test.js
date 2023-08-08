import { render } from "@testing-library/react";
import moment from "moment";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import AgentsListTable from "./AgentsListTable";

describe("components/Agents/ListTable", () => {
  const agents = [
    {
      id: "agent-id",
      ip: "agent IP",
      hostname: "agent hostname",
      agentStatus: "CREATING",
      createdAt: moment("2018-05-24T13:48:04.313000"),
      updatedAt: moment("2018-05-24T13:48:04.313000")
    },
    {
      id: "agent-id",
      ip: "agent IP",
      hostname: "agent hostname",
      agentStatus: "DISABLED",
      createdAt: moment("2019-05-24T13:48:04.313000"),
      updatedAt: moment("2019-05-24T13:48:04.313000")
    }
  ];
  test(`should render AgentsListTable component`, async () => {
    const rendered = render(
      <MemoryRouter initialEntries={["/agents"]}>
        <AgentsListTable agents={agents} isLoading={false} />
      </MemoryRouter>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });

  test(`should render AgentsListTable loader`, async () => {
    const rendered = render(
      <MemoryRouter initialEntries={["/agents"]}>
        <AgentsListTable agents={agents} isLoading={true} />
      </MemoryRouter>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
