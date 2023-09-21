import { render } from "@testing-library/react";
import moment from "moment";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { UserContext } from "../../../context/User";
import RunRunningStatus from "./RunRunningStatus";

describe("RunRunningStatus", () => {
  const mockUserContext = {
    user: {
      name: "Test User"
    }
  };

  const mockRun = {
    id: "123",
    runConfigurationId: "456",
    title: "Test Run",
    runStatus: "RUNNING",
    startedAt: moment("2018-05-24T13:48:04.313000"),
    finishedAt: null, // Set to a date if the runStatus is not "RUNNING"
    agentIds: ["agent-1", "agent-2"],
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
    labels: ["Label1", "Label2"],
    notes: "Test notes",
    loadProfile: {},
    isLoadProfileEnabled: true
  };

  test("should render RunRunningStatus component", () => {
    const rendered = render(
      <UserContext.Provider value={mockUserContext}>
        <MemoryRouter>
          <RunRunningStatus run={mockRun} />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const component = rendered.container;
    expect(component.outerHTML).toMatchSnapshot();
  });
});
