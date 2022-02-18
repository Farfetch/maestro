import { render } from "@testing-library/react";
import React from "react";

import RunEditableLabelsGroup from "./RunEditableLabelsGroup";

describe("components/Run/RunningStatus/EditableLabelsGroup", () => {
  const runId = "test";
  test(`should render RunEditableLabelsGroup component`, async () => {
    const rendered = render(
      <RunEditableLabelsGroup runId={runId} defaultValue={[]} />
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });

  test(`should render RunEditableLabelsGroup component with default value`, async () => {
    const rendered = render(
      <RunEditableLabelsGroup
        runId={runId}
        defaultValue={["label1", "label2"]}
      />
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
