import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import AvailableAgents from "./AvailableAgents";

jest.mock("../../../../../lib/api/endpoints/agent", () => ({
  fetchAgents: () => [
    {
      id: "agent-id",
      hostname: "agent-hostname",
      ip: "test-ip",
      agentStatus: "AVAILABLE"
    }
  ]
}));

afterEach(cleanup);

describe("components/RunConfiguration/Form/AvailableAgents", () => {
  test(`should render AvailableAgents component`, async () => {
    const { container } = render(
      <Form>
        <AvailableAgents />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
