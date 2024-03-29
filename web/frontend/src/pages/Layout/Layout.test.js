import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { CurrentWorkspaceContext } from "../../context/CurrentWorkspace";
import { RunningContext } from "../../context/Running";
import { UserContext } from "../../context/User";
import Layout from "./Layout";

describe("pages/Layout", () => {
  test(`should render Layout component`, async () => {
    const user = {
      id: "user-id",
      name: "Test Maestro",
      email: "test@maestro.net"
    };
    const workspaces = [
      {
        id: "workspace-1",
        name: "workspace-1"
      },
      {
        id: "workspace-2",
        name: "workspace-2"
      }
    ];
    const runs = [
      {
        id: "run-id",
        title: "run-title"
      },
      {
        id: "run-id2",
        title: "run-title2"
      }
    ];

    const rendered = render(
      <UserContext.Provider value={{ user, workspaces }}>
        <CurrentWorkspaceContext.Provider
          value={{ currentWorkspace: workspaces[0] }}
        >
          <RunningContext.Provider value={{ runs }}>
            <MemoryRouter initialEntries={["/"]}>
              <Layout />
            </MemoryRouter>
          </RunningContext.Provider>
        </CurrentWorkspaceContext.Provider>
      </UserContext.Provider>
    );

    const badgeComponent = rendered.container;
    expect(badgeComponent.outerHTML).toMatchSnapshot();
  });
});
