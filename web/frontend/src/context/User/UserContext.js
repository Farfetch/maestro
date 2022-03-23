import { createContext, useEffect, useState } from "react";

import PageSpinner from "../../components/layout/PageSpinner";
import { fetchMe } from "../../lib/api/endpoints/user";
import { fetchWorkspaces } from "../../lib/api/endpoints/workspace";
import { userRole as userRoleModel } from "../../lib/api/models";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await fetchMe();
      const allWorkspaces = await fetchWorkspaces();

      let userWorkspaces = allWorkspaces;

      if (userData.role === userRoleModel.USER) {
        userWorkspaces = userWorkspaces.filter(({ id }) =>
          userData.workspaceIds.includes(id)
        );
      }

      setWorkspaces(userWorkspaces);
      setUser(userData);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <UserContext.Provider value={{ user, workspaces }}>
      {children}
    </UserContext.Provider>
  );
};
