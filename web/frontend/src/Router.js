import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";

const Router = ({ children }) => (
  <BrowserRouter>
    {children}
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
