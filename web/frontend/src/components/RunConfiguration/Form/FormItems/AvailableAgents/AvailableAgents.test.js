import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import AvailableAgents from "./AvailableAgents";

afterEach(cleanup);

describe("components/RunConfiguration/Form/AvailableAgents", () => {
  test(`should render AvailableAgents component`, async () => {
    const agents = [
      {
        id: "agent-id",
        hostname: "agent-hostname",
        ip: "test-ip",
        agentStatus: "AVAILABLE"
      }
    ];
    const { container } = render(
      <Form
        initialValues={{
          agentIds: []
        }}
      >
        <AvailableAgents agents={agents} />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
