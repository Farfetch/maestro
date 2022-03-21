import { render } from "@testing-library/react";
import moment from "moment";
import React from "react";

import Avatar from "./Avatar";

describe("components/layout/Avatar", () => {
  test(`should render Avatar with first letter from email`, async () => {
    const user = {
      id: "user-id",
      name: "",
      email: "test@maestro.net",
      createdAt: moment("2018-05-24T13:48:04.313000"),
      updatedAt: moment("2018-05-24T13:48:04.313000")
    };

    const rendered = render(<Avatar user={user} />);

    const avatarComponent = rendered.container;
    expect(avatarComponent.outerHTML).toMatchSnapshot();
  });

  test(`should render Avatar with initials from name`, async () => {
    const user = {
      id: "user-id",
      name: "Test User",
      email: "email@maestro.net",
      createdAt: moment("2018-05-24T13:48:04.313000"),
      updatedAt: moment("2018-05-24T13:48:04.313000")
    };

    const rendered = render(<Avatar user={user} />);

    const avatarComponent = rendered.container;
    expect(avatarComponent.outerHTML).toMatchSnapshot();
  });
});
