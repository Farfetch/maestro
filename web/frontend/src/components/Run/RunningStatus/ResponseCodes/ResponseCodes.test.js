import { render } from "@testing-library/react";
import React from "react";

import ResponseCodes from "./ResponseCodes";

describe("ResponseCodes", () => {
  const mockErrorCodes = {
    500: [{ key: "error1", errorsCount: 5, responses: [] }],
    501: [{ key: "error2", errorsCount: 3, responses: [] }]
  };

  test("should render ResponseCodes component", () => {
    const rendered = render(<ResponseCodes errorCodes={mockErrorCodes} />);
    const component = rendered.container;
    expect(component.outerHTML).toMatchSnapshot();
  });
});
