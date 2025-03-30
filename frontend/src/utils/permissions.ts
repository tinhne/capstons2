import { User } from "../features/auth/types";

export const hasPermission = (
  user: User | null,
  permission: string
): boolean => {
  if (!user) return false;
  return user.roles.some((role) =>
    role.permissions.some((p) => p.name === permission)
  );
};
