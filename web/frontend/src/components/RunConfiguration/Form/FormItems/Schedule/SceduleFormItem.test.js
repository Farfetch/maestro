import { cleanup, render, waitFor } from "@testing-library/react";
import { Form } from "antd";
import React from "react";

import SceduleFormItem from "./SceduleFormItem";

afterEach(cleanup);

describe("components/RunConfiguration/Form/SceduleFormItem", () => {
  test(`should render SceduleFormItem component`, async () => {
    const { container } = render(
      <Form>
        <SceduleFormItem />
      </Form>
    );

    await waitFor(() => {
      expect(container.outerHTML).toMatchSnapshot();
    });
  });
});
