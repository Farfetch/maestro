import { render } from "@testing-library/react";
import React from "react";

import ResponseCodes from "./ResponseCodes";

describe("ResponseCodes", () => {
  const mockRunId = "123";

  test("should render ResponseCodes component", () => {
    const rendered = render(<ResponseCodes runId={mockRunId} />);
    const component = rendered.container;
    expect(component.outerHTML).toMatchSnapshot();
  });
});
