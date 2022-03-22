import { render } from "@testing-library/react";
import { Button } from "antd";
import React from "react";
import { Link, MemoryRouter } from "react-router-dom";

import PageTitle from "./PageTitle";

describe("components/PageTitle", () => {
  [
    {
      title: "Test title"
    },
    {
      title: "Test title",
      button: (
        <Link to="/button-test-link">
          <Button type="primary" size="large">
            Button title
          </Button>
        </Link>
      )
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
