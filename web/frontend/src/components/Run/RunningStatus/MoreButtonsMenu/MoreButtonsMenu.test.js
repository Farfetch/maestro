import { render } from "@testing-library/react";
import React from "react";

import MoreButtonsMenu from "./MoreButtonsMenu";

describe("components/Run/RunningStatus/MoreButtonsMenu", () => {
  test(`should render MoreButtonsMenu component`, async () => {
    const rendered = render(<MoreButtonsMenu runId="1-2-3" />);

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
