import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import Layout from "./Layout";

describe("pages/Layout", () => {
  test(`should render Layout component`, async () => {
    const rendered = render(
      <MemoryRouter initialEntries={["/"]}>
        <Layout />
      </MemoryRouter>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
