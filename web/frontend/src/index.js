import React from "react";
import ReactDOM from "react-dom";

import { UserContextProvider } from "./context/User";
import Router from "./Router";

ReactDOM.render(
  // <React.StrictMode>
  <UserContextProvider>
    <Router />
  </UserContextProvider>,

  // </React.StrictMode>,
  document.getElementById("root")
);
