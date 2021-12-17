import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import TestsPage from "./pages/Tests";
import TestsNewPage from "./pages/TestsNew";
import TestsSinglePage from "./pages/TestsSingle";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tests" element={<TestsPage />}>
          <Route path="new" element={<TestsNewPage />} />
          <Route path=":runConfigurationId" element={<TestsSinglePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
