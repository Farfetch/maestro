import { render } from "@testing-library/react";
import React from "react";

import { UserContext } from "../../../context/User";
import Profile from "./Profile";

describe("components/Header/Profile", () => {
  test(`should render Profile component from UserContext`, async () => {
    const user = {
      id: "user-id",
      name: "Test Maestro",
      email: "test@maestro.net"
    };

    const rendered = render(
      <UserContext.Provider value={{ user }}>
        <Profile />
      </UserContext.Provider>
    );

    const profileComponent = rendered.container;
    expect(profileComponent.outerHTML).toMatchSnapshot();
  });
});
