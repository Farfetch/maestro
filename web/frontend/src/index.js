import React from "react";
import ReactDOM from "react-dom";

import { CurrentWorkspaceContextProvider } from "./context/CurrentWorkspace";
import { UserContextProvider } from "./context/User";
import Router from "./Router";

ReactDOM.render(
  // <React.StrictMode>
  <UserContextProvider>
    <CurrentWorkspaceContextProvider>
      <Router />
    </CurrentWorkspaceContextProvider>
  </UserContextProvider>,

  // </React.StrictMode>,
  document.getElementById("root")
);
