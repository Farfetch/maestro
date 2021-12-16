import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";

const Router = ({ children }) => (
  <BrowserRouter>
    {children}
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>

      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Router;
