import { cleanup, render, waitFor } from "@testing-library/react";
import moment from "moment";
import React from "react";

import UserListTable from "./UserListTable";

afterEach(cleanup);

describe("components/User/UserListTable", () => {
  test(`should render UserListTable component`, async () => {
    const users = [
      {
        id: "user-id-1",
        name: "user 1",
        email: "user1@maestro.net",
        role: "USER",
        workspaceIds: ["1-2-3", "4-5-6"],
        createdAt: moment("2018-05-24T13:48:04.313000"),
        updatedAt: moment("2018-05-24T13:48:04.313000")
      },
      {
        id: "user-id-2",
        name: "user 2",
        email: "user2@maestro.net",
        role: "USER",
        workspaceIds: ["4-5-6"],
        createdAt: moment("2018-05-24T13:48:04.313000"),
        updatedAt: moment("2018-05-24T13:48:04.313000")
      }
    ];

    const workspaces = [
      {
        id: "1-2-3",
        name: "Workspace 1",
        createdAt: moment("2018-05-24T13:48:04.313000"),
        updatedAt: moment("2018-05-24T13:48:04.313000")
      },
      {
        id: "4-5-6",
        name: "Workspace 2",
        createdAt: moment("2018-05-24T13:48:04.313000"),
        updatedAt: moment("2018-05-24T13:48:04.313000")
      }
    ];

    const { container } = render(
      <UserListTable
        isLoading={false}
        refresh={() => null}
        users={users}
        workspaces={workspaces}
      />
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
