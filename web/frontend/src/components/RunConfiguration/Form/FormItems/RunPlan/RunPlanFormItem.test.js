import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import RunPlanFormItem from "./RunPlanFormItem";

afterEach(cleanup);

describe("components/RunConfiguration/Form/RunPlanFormItem", () => {
  test(`should render RunPlanFormItem component`, async () => {
    const { container } = render(
      <Form>
        <RunPlanFormItem />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
