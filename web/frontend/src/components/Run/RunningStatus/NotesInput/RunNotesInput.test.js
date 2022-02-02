import { render } from "@testing-library/react";
import React from "react";

import RunNotesInput from "./RunNotesInput";

describe("components/Agents/ListTable", () => {
  const runId = "test";
  test(`should render RunNotesInput component`, async () => {
    const rendered = render(<RunNotesInput runId={runId} defaultValue="" />);

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });

  test(`should render RunNotesInput component with default value`, async () => {
    const rendered = render(
      <RunNotesInput runId={runId} defaultValue="My previously saved notes" />
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
