import { cleanup, render, waitFor } from "@testing-library/react";
import moment from "moment";
import React from "react";

import CreateUserForm from "./CreateUserForm";

afterEach(cleanup);

describe("components/User/CreateUserForm", () => {
  test(`should render CreateUserForm component`, async () => {
    const users = [
      {
        id: "user-id-1",
        name: "user 1",
        email: "user1@maestro.net",
        role: "USER",
        workspaceIds: ["1-2-3", "4-5-6"],
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      },
      {
        id: "user-id-2",
        name: "user 2",
        email: "user2@maestro.net",
        role: "USER",
        workspaceIds: ["4-5-6"],
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      }
    ];

    const workspaces = [
      {
        id: "1-2-3",
        name: "Workspace 1",
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      },
      {
        id: "4-5-6",
        name: "Workspace 2",
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      }
    ];

    const { container } = render(
      <CreateUserForm
        form={null}
        initialValues={{}}
        onFinish={() => null}
        users={users}
        workspaces={workspaces}
      />
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });

  test(`should render CreateUserForm component with Initial values`, async () => {
    const users = [
      {
        id: "user-id-1",
        name: "user 1",
        email: "user1@maestro.net",
        role: "USER",
        workspaceIds: ["1-2-3", "4-5-6"],
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      },
      {
        id: "user-id-2",
        name: "user 2",
        email: "user2@maestro.net",
        role: "USER",
        workspaceIds: ["4-5-6"],
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      }
    ];

    const workspaces = [
      {
        id: "1-2-3",
        name: "Workspace 1",
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      },
      {
        id: "4-5-6",
        name: "Workspace 2",
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      }
    ];

    const { container } = render(
      <CreateUserForm
        form={null}
        initialValues={users[0]}
        onFinish={() => null}
        users={users}
        workspaces={workspaces}
      />
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
