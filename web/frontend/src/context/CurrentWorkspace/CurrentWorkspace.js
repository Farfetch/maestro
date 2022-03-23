import { createContext, useContext, useState } from "react";

import { UserContext } from "../User";

export const CurrentWorkspaceContext = createContext(null);

export const CurrentWorkspaceContextProvider = ({ children }) => {
  const { workspaces } = useContext(UserContext);
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);

  return (
    <CurrentWorkspaceContext.Provider
      value={{ currentWorkspace, setCurrentWorkspace }}
    >
      {children}
    </CurrentWorkspaceContext.Provider>
  );
};
