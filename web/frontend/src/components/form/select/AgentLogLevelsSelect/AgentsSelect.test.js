import { render } from "@testing-library/react";
import React from "react";

import AgentLogLevelsSelect from "./AgentLogLevelsSelect";

describe("components/form/select/AgentLogLevelsSelect", () => {
  ["single", "multiple"].map((mode) =>
    test(`should render AgentLogLevelsSelect component with mode=${mode}`, async () => {
      const rendered = render(<AgentLogLevelsSelect mode={mode} />);

      const badgeComponent = rendered.container;
      expect(badgeComponent.outerHTML).toMatchSnapshot();
    })
  );
});
