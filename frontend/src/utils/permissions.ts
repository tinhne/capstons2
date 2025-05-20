import { User } from "../features/auth/types";
import { UserRole } from "../types/user";

/**
 * Danh sách các hành động (permissions) trong hệ thống
 */
export enum Permission {
  // Quản trị hệ thống
  ADMIN_VIEW_DASHBOARD = "admin:view-dashboard",
  ADMIN_MANAGE_USERS = "admin:manage-users",
  ADMIN_MANAGE_SETTINGS = "admin:manage-settings",

  // Quản lý người dùng
  USER_VIEW_PROFILE = "user:view-profile",
  USER_EDIT_PROFILE = "user:edit-profile",

  // Quản lý chat
  CHAT_CREATE = "chat:create",
  CHAT_VIEW_HISTORY = "chat:view-history",

  // Quản lý bệnh
  DISEASE_VIEW = "disease:view",
  DISEASE_PREDICT = "disease:predict",
  DISEASE_MANAGE = "disease:manage",
}

/**
 * Map vai trò với quyền tương ứng
 */
const rolePermissionsMap: Record<UserRole, Permission[]> = {
  // Quyền của Admin
  [UserRole.ADMIN]: [
    // Tất cả quyền admin
    Permission.ADMIN_VIEW_DASHBOARD,
    Permission.ADMIN_MANAGE_USERS,
    Permission.ADMIN_MANAGE_SETTINGS,

    // Tất cả quyền của bác sĩ
    Permission.DISEASE_VIEW,
    Permission.DISEASE_PREDICT,
    Permission.DISEASE_MANAGE,

    // Tất cả quyền của người dùng
    Permission.USER_VIEW_PROFILE,
    Permission.USER_EDIT_PROFILE,
    Permission.CHAT_CREATE,
    Permission.CHAT_VIEW_HISTORY,
  ],

  // Quyền của Bác sĩ
  [UserRole.DOCTOR]: [
    Permission.DISEASE_VIEW,
    Permission.DISEASE_PREDICT,
    Permission.DISEASE_MANAGE,
    Permission.USER_VIEW_PROFILE,
    Permission.USER_EDIT_PROFILE,
    Permission.CHAT_CREATE,
    Permission.CHAT_VIEW_HISTORY,
  ],

  // Quyền của Người dùng thường
  [UserRole.USER]: [
    Permission.USER_VIEW_PROFILE,
    Permission.USER_EDIT_PROFILE,
    Permission.CHAT_CREATE,
    Permission.CHAT_VIEW_HISTORY,
    Permission.DISEASE_VIEW,
    Permission.DISEASE_PREDICT,
  ],
};

/**
 * Kiểm tra người dùng có quyền thực hiện một hành động hay không
 * @param role Vai trò người dùng
 * @param permission Quyền cần kiểm tra
 * @returns true nếu người dùng có quyền, false nếu không
 */
export function checkPermission(
  role: UserRole,
  permission: Permission
): boolean {
  // Nếu không có vai trò hợp lệ, không có quyền
  if (!role || !rolePermissionsMap[role]) {
    return false;
  }

  // Kiểm tra quyền trong danh sách quyền của vai trò
  return rolePermissionsMap[role].includes(permission);
}

/**
 * Kiểm tra người dùng có một trong các quyền hay không
 * @param role Vai trò người dùng
 * @param permissions Danh sách quyền cần kiểm tra
 * @returns true nếu người dùng có ít nhất một quyền, false nếu không
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => checkPermission(role, permission));
}

/**
 * Kiểm tra người dùng có tất cả các quyền hay không
 * @param role Vai trò người dùng
 * @param permissions Danh sách quyền cần kiểm tra
 * @returns true nếu người dùng có tất cả quyền, false nếu không
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => checkPermission(role, permission));
}

/**
 * Lấy tất cả quyền của một vai trò
 * @param role Vai trò người dùng
 * @returns Danh sách quyền của vai trò
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissionsMap[role] || [];
}

export const hasPermission = (
  user: User | null,
  permission: string
): boolean => {
  if (!user) return false;
  return user.roles?.some((role) =>
    role.permissions.some((p) => p.name === permission)
  ) ?? false;
};
