import { render } from "@testing-library/react";
import moment from "moment";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import RunListTable from "./RunListTable";

describe("components/RunConfiguration/Table", () => {
  const runs = [
    {
      id: "run-configuration-id",
      title: "Confgiuration title",
      runStatus: "RUNNING",
      notes: "Test notes field",
      createdAt: moment("2018-05-24T13:48:04.313000"),
      updatedAt: moment("2018-05-24T13:48:04.313000")
    }
  ];
  test(`should render RunConfigurationTable component`, async () => {
    const rendered = render(
      <MemoryRouter initialEntries={["/runs"]}>
        <RunListTable runs={runs} isLoading={false} />
      </MemoryRouter>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });

  test(`should render RunConfigurationTable loader`, async () => {
    const rendered = render(
      <MemoryRouter initialEntries={["/runs"]}>
        <RunListTable runs={runs} isLoading={true} />
      </MemoryRouter>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
