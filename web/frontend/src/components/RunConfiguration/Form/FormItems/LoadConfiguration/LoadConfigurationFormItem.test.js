import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import LoadConfigurationForm from "./LoadConfigurationForm/LoadConfigurationForm";

afterEach(cleanup);

describe("components/RunConfiguration/Form/FormItems/LoadConfigurationForm", () => {
  test(`should render LoadConfigurationForm component`, async () => {
    const { container } = render(
      <Form>
        <LoadConfigurationForm />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
