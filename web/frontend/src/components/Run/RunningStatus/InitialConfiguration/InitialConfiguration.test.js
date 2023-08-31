import { render } from "@testing-library/react";
import React from "react";

import { UserContext } from "../../../../context/User";
import InitialConfiguration from "./InitialConfiguration";

describe("InitialConfiguration", () => {
  const mockUserContext = {
    user: {
      name: "Test User"
    }
  };

  const mockRun = {
    runConfigurationId: "123",
    runPlans: [
      {
        uid: "plan-1",
        name: "Test Plan 1",
        status: "done",
        url: "http://example.com/test-plan-1"
      },
      {
        uid: "plan-2",
        name: "Test Plan 2",
        status: "done",
        url: "http://example.com/test-plan-2"
      }
    ],
    customData: [
      {
        uid: "custom-data-1",
        name: "Custom Data 1",
        status: "done",
        url: "http://example.com/custom-data-1"
      },
      {
        uid: "custom-data-2",
        name: "Custom Data 2",
        status: "done",
        url: "http://example.com/custom-data-2"
      }
    ],
    agentIds: ["agent-1", "agent-2"],
    agentsNames: [
      {
        id: "agent-1",
        ip: "192.168.1.1",
        name: "Agent 1"
      },
      {
        id: "agent-2",
        ip: "192.168.1.2",
        name: "Agent 2"
      }
    ],
    hosts: [
      {
        host: "Host 1",
        ip: "192.168.1.10"
      },
      {
        host: "Host 2",
        ip: "192.168.1.20"
      }
    ],
    customProperties: [
      {
        name: "Property 1",
        value: "Value 1"
      },
      {
        name: "Property 2",
        value: "Value 2"
      }
    ],
    loadProfile: {},
    isLoadProfileEnabled: true
  };

  test("should render InitialConfiguration component", () => {
    const rendered = render(
      <UserContext.Provider value={mockUserContext}>
        <InitialConfiguration run={mockRun} />
      </UserContext.Provider>
    );
    const component = rendered.container;
    expect(component.outerHTML).toMatchSnapshot();
  });
});
