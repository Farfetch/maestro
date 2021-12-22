import { render } from "@testing-library/react";

import CircleSpinner from "./CircleSpinner";

describe("components/form/select/CircleSpinner", () => {
  test(`should render CircleSpinner component`, async () => {
    const rendered = render(<CircleSpinner />);

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
