import { render } from "@testing-library/react";
import moment from "moment";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import RunConfigurationsTable from "./RunConfigurationsTable";

describe("components/RunConfiguration/Table", () => {
  const runConfigurations = [
    {
      id: "run-configuration-id",
      title: "Confgiuration title",
      runPlanId: "run-plan-id",
      createdAt: moment("2018-05-24T13:48:04.313000"),
      updatedAt: moment("2018-05-24T13:48:04.313000")
    }
  ];
  test(`should render RunConfigurationTable component`, async () => {
    const rendered = render(
      <MemoryRouter initialEntries={["/tests"]}>
        <RunConfigurationsTable
          runConfigurations={runConfigurations}
          isLoading={false}
        />
      </MemoryRouter>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });

  test(`should render RunConfigurationTable loader`, async () => {
    const rendered = render(
      <MemoryRouter initialEntries={["/tests"]}>
        <RunConfigurationsTable
          runConfigurations={runConfigurations}
          isLoading={true}
        />
      </MemoryRouter>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
