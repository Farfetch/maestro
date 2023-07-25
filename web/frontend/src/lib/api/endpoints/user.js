import ErrorHandler from "../../../ErrorHandler";
import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const userObjectMapper = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  workspaceIds: user.workspace_ids,
  lastLoginAt: user.last_login_at ? toLocalDate(user.last_login_at) : null,
  createdAt: toLocalDate(user.created_at),
  updatedAt: toLocalDate(user.updated_at)
});

export const fetchMe = async () => {
  try {
    const res = await maestroClient.get("/api/me");

    const user = userObjectMapper(res.data);

    return user;
  } catch (error) {
    ErrorHandler.handleError(error, "user");
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const res = await maestroClient.get("/api/users");

    const users = res.data.map(userObjectMapper);

    return users;
  } catch (error) {
    ErrorHandler.handleError(error, "users");
    return [];
  }
};

/**
 *
 * @param {object} data
 * @returns User object
 */
export const createUser = async ({ name, email, role, workspaceIds }) => {
  try {
    const res = await maestroClient.post("/api/user", {
      name,
      email,
      role,
      workspace_ids: workspaceIds
    });

    const createdUser = userObjectMapper(res.data);

    return createdUser;
  } catch (error) {
    ErrorHandler.handleError(error, "user");
    return [];
  }
};

/**
 *
 * @param {ID} userId
 * @param {object} data
 * @returns User object
 */
export const updateUser = async (
  userId,
  { name, email, role, workspaceIds }
) => {
  try {
    const res = await maestroClient.put(`/api/user/${userId}`, {
      name,
      email,
      role,
      workspace_ids: workspaceIds
    });

    const updatedUser = userObjectMapper(res.data);

    return updatedUser;
  } catch (error) {
    ErrorHandler.handleError(error, `userwith ID: ${userId}`);
    return [];
  }
};

/**
 *
 * @param {ID} userId
 * @returns User object
 */
export const deleteUser = async (userId) => {
  try {
    const res = await maestroClient.delete(`/api/user/${userId}`);

    const deletedUser = userObjectMapper(res.data);

    return deletedUser;
  } catch (error) {
    ErrorHandler.handleError(error, "user");
    return [];
  }
};
