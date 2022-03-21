import { createContext, useEffect, useState } from "react";

import PageSpinner from "../../components/layout/PageSpinner";
import { fetchMe } from "../../lib/api/endpoints/user";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await fetchMe();

      setUser(userData);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
