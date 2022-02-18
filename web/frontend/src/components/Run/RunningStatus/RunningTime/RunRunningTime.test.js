import { render } from "@testing-library/react";
import mockDate from "mockdate";
import React from "react";

import { toLocalDate } from "../../../../lib/date";
import RunRunningTime from "./RunRunningTime";

describe("components/Run/RunningStatus/RunRunningTime", () => {
  test(`should render Statistic component`, async () => {
    const startedAt = toLocalDate("2021-04-14 12:29:20");
    const finishedAt = toLocalDate("2021-04-14 14:29:20");

    const rendered = render(
      <RunRunningTime startedAt={startedAt} finishedAt={finishedAt} />
    );

    const renderedContainer = rendered.container;
    expect(renderedContainer.outerHTML).toMatchSnapshot();
  });

  test(`should render Timer component`, async () => {
    const startedAt = toLocalDate("2021-04-14 12:29:20");
    mockDate.set(toLocalDate("2021-04-14 12:31:20"));

    const rendered = render(
      <RunRunningTime startedAt={startedAt} finishedAt={false} />
    );

    const renderedContainer = rendered.container;
    expect(renderedContainer.outerHTML).toMatchSnapshot();

    mockDate.reset();
  });
});
