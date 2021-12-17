import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import PageTitle from "./PageTitle";

describe("components/PageTitle", () => {
  [
    {
      title: "Test title"
    },
    {
      title: "Test title",
      button: {
        link: "/button-test-link",
        title: "Button title"
      }
    }
  ].map((props) =>
    test(`should render PageTitle component`, async () => {
      const rendered = render(
        <MemoryRouter initialEntries={["/tests"]}>
          <PageTitle {...props} />
        </MemoryRouter>
      );

      const badgeComponent = rendered.container;
      expect(badgeComponent.outerHTML).toMatchSnapshot();
    })
  );
});
