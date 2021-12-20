import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import RunHostsFormItem from "./RunHostsFormItem";

afterEach(cleanup);

describe("components/RunConfiguration/Form/RunHostsFormItem", () => {
  test(`should render RunHostsFormItem component`, async () => {
    const { container } = render(
      <Form>
        <RunHostsFormItem />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
