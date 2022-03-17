import { render } from "@testing-library/react";
import MockDate from "mockdate";
import moment from "moment";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { toLocalDate } from "../../../lib/date";
import RunConfigurationsTable from "./RunConfigurationsTable";

describe("components/RunConfiguration/Table", () => {
  afterEach(() => {
    MockDate.reset();
  });
  const runConfigurations = [
    {
      id: "run-configuration-id-1",
      title: "Confgiuration title",
      runPlanId: "run-plan-id",
      createdAt: moment("2018-05-24T13:48:04.313000"),
      updatedAt: moment("2018-05-24T13:48:04.313000")
    }
  ];
  test(`should render RunConfigurationTable component`, async () => {
    MockDate.set(toLocalDate("2022-03-03 00:00:00"));
    const rendered = render(
      <MemoryRouter initialEntries={["/tests"]}>
        <RunConfigurationsTable
          runConfigurations={runConfigurations}
          isLoading={false}
        />
      </MemoryRouter>
    );

    const runConfigurationTableComponent = rendered.container;
    expect(runConfigurationTableComponent.outerHTML).toMatchSnapshot();
  });

  test(`should render RunConfigurationTable loader`, async () => {
    MockDate.set(toLocalDate("2022-03-03 00:00:00"));
    const rendered = render(
      <MemoryRouter initialEntries={["/tests"]}>
        <RunConfigurationsTable
          runConfigurations={runConfigurations}
          isLoading={true}
        />
      </MemoryRouter>
    );

    const runConfigurationTableComponent = rendered.container;
    expect(runConfigurationTableComponent.outerHTML).toMatchSnapshot();
  });

  test(`should render RunConfigurationTable nextRun column`, async () => {
    MockDate.set(toLocalDate("2022-03-03 00:00:00"));
    const runConfigurationsWithSchedule = [
      {
        id: "run-configuration-id-1",
        title: "Confgiuration title",
        runPlanId: "run-plan-id",
        schedule: {
          days: ["Thu"],
          time: "13:50"
        },
        createdAt: moment("2018-05-24T13:48:04.313000"),
        updatedAt: moment("2018-05-24T13:48:04.313000")
      },
      {
        id: "run-configuration-id-2",
        title: "Confgiuration title",
        runPlanId: "run-plan-id",
        schedule: {
          days: ["Thu"],
          time: "13:00"
        },
        createdAt: moment("2018-05-24T13:48:04.313000"),
        updatedAt: moment("2018-05-24T13:48:04.313000")
      },
      {
        id: "run-configuration-id-3",
        title: "Confgiuration title",
        runPlanId: "run-plan-id",
        schedule: {
          days: ["Sun"],
          time: "10:00"
        },
        createdAt: moment("2018-05-24T13:48:04.313000"),
        updatedAt: moment("2018-05-24T13:48:04.313000")
      }
    ];
    const rendered = render(
      <MemoryRouter initialEntries={["/tests"]}>
        <RunConfigurationsTable
          runConfigurations={runConfigurationsWithSchedule}
          isLoading={false}
        />
      </MemoryRouter>
    );

    const runConfigurationTableComponent = rendered.container;
    expect(runConfigurationTableComponent.outerHTML).toMatchSnapshot();
  });
});
