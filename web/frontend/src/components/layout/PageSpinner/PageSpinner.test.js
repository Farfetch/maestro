import { render } from "@testing-library/react";

import PageSpinner from "./PageSpinner";

describe("components/form/select/PageSpinner", () => {
  test(`should render PageSpinner component`, async () => {
    const rendered = render(<PageSpinner />);

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
