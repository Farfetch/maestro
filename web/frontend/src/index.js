import React from "react";
import ReactDOM from "react-dom";

import { CurrentWorkspaceContextProvider } from "./context/CurrentWorkspace";
import { RunningContextProvider } from "./context/Running";
import { UserContextProvider } from "./context/User";
import Router from "./Router";

ReactDOM.render(
  <UserContextProvider>
    <CurrentWorkspaceContextProvider>
      <RunningContextProvider>
        <Router />
      </RunningContextProvider>
    </CurrentWorkspaceContextProvider>
  </UserContextProvider>,

  document.getElementById("root")
);
