import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import TitleFormItem from "./TitleFormItem";

afterEach(cleanup);

describe("components/RunConfiguration/Form/TitleFormItem", () => {
  test(`should render TitleFormItem component`, async () => {
    const { container } = render(
      <Form>
        <TitleFormItem />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
