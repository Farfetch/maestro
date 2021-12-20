import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import RunCustomPropertiesFormItem from "./RunCustomPropertiesFormItem";

afterEach(cleanup);

describe("components/RunConfiguration/Form/RunCustomPropertiesFormItem", () => {
  test(`should render RunCustomPropertiesFormItem component`, async () => {
    const { container } = render(
      <Form>
        <RunCustomPropertiesFormItem />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
