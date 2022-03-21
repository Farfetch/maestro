import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const meObjectMapper = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  workspaceIds: user.workspace_ids,
  lastLoginAt: toLocalDate(user.last_login_at),
  createdAt: toLocalDate(user.created_at),
  updatedAt: toLocalDate(user.updated_at)
});

export const fetchMe = async () => {
  const res = await maestroClient.get("/api/me");

  const user = meObjectMapper(res.data);

  return user;
};
