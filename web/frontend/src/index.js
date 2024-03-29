import ReactDOM from "react-dom";
import { ErrorBoundary } from "react-error-boundary";

import { CurrentWorkspaceContextProvider } from "./context/CurrentWorkspace";
import { RunningContextProvider } from "./context/Running";
import { UserContextProvider } from "./context/User";
import ErrorHandler from "./ErrorHandler";
import Router from "./Router";

ErrorHandler.setup();

function ErrorFallback({ error }) {
  ErrorHandler.handleError(error);

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.stack}</pre>
    </div>
  );
}

ReactDOM.render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <UserContextProvider>
      <CurrentWorkspaceContextProvider>
        <RunningContextProvider>
          <Router />
        </RunningContextProvider>
      </CurrentWorkspaceContextProvider>
    </UserContextProvider>
  </ErrorBoundary>,
  document.getElementById("root")
);
