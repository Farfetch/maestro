import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const workspaceObjectMapper = (workspace) => ({
  id: workspace.id,
  name: workspace.name,
  isDefault: workspace.is_default,
  createdAt: toLocalDate(workspace.created_at),
  updatedAt: toLocalDate(workspace.updated_at)
});

/**
 *
 * @param {object} filters
 *   isDefault - boolean param. Default: ALL
 * @returns
 */
export const fetchWorkspaces = async (filters = false) => {
  const res = await maestroClient.get("/api/workspaces");

  const workspaces = res.data.map(workspaceObjectMapper);

  if (filters) {
    return workspaces.filter(
      ({ isDefault }) => isDefault === filters.isDefault
    );
  }

  return workspaces;
};

export const createWorkspace = async ({ name, usersEmail }) => {
  const res = await maestroClient.post("/api/workspace", {
    name,
    users_email: usersEmail
  });

  const createdWorkspace = workspaceObjectMapper(res.data);

  return createdWorkspace;
};

export const updateWorkspace = async (workspaceId, { name, usersEmail }) => {
  const res = await maestroClient.put(`/api/workspace/${workspaceId}`, {
    name,
    users_email: usersEmail
  });

  const updatedWorkspace = workspaceObjectMapper(res.data);

  return updatedWorkspace;
};

export const deleteWorkspace = async (workspaceId) => {
  const res = await maestroClient.delete(`/api/workspace/${workspaceId}`);

  const deletedWorkspace = workspaceObjectMapper(res.data);

  return deletedWorkspace;
};
