import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import CustomDataFormItem from "./CustomDataFormItem";

afterEach(cleanup);

describe("components/RunConfiguration/Form/CustomDataFormItem", () => {
  test(`should render CustomDataFormItem component`, async () => {
    const { container } = render(
      <Form>
        <CustomDataFormItem />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
