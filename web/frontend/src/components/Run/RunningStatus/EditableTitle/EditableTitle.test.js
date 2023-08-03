import { render } from "@testing-library/react";
import React from "react";

import EditableTitle from "./EditableTitle";

describe("components/Agents/ListTable", () => {
  const runId = "test";
  const runTitle = "title test";
  test(`should render EditableTitle component with curren title`, async () => {
    const rendered = render(
      <EditableTitle runId={runId} currentTitle={runTitle} />
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
