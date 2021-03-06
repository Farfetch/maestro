import { cleanup, render, waitFor } from "@testing-library/react";
import moment from "moment";
import React from "react";

import CreateWorkspaceForm from "./CreateWorkspaceForm";

afterEach(cleanup);

describe("components/Workspace/CreateWorkspaceForm", () => {
  test(`should render CreateWorkspaceForm component`, async () => {
    const users = [
      {
        id: "user-id",
        email: "user1@maestro.net",
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      }
    ];

    const { container } = render(
      <CreateWorkspaceForm
        form={null}
        initialValues={{}}
        onFinish={() => null}
        users={users}
      />
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });

  test(`should render CreateWorkspaceForm component with initialValues`, async () => {
    const users = [
      {
        id: "user-id",
        email: "user1@maestro.net",
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      },
      {
        id: "user-id-2",
        email: "user2@maestro.net",
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      },
      {
        id: "user-id-3",
        email: "user3@maestro.net",
        createdAt: moment("2018-05-24 13:48:00"),
        updatedAt: moment("2018-05-24 13:48:00")
      }
    ];

    const { container } = render(
      <CreateWorkspaceForm
        form={null}
        initialValues={{
          name: "Some default value",
          usersEmail: ["user1@maestro.net", "user3@maestro.net"]
        }}
        onFinish={() => null}
        users={users}
      />
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
