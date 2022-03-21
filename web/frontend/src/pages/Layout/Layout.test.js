import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { UserContext } from "../../context/User";
import Layout from "./Layout";

describe("pages/Layout", () => {
  test(`should render Layout component`, async () => {
    const user = {
      id: "user-id",
      name: "Test Maestro",
      email: "test@maestro.net"
    };
    const rendered = render(
      <UserContext.Provider value={{ user }}>
        <MemoryRouter initialEntries={["/"]}>
          <Layout />
        </MemoryRouter>
      </UserContext.Provider>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
