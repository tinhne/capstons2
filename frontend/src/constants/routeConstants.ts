/**
 * Tất cả các định nghĩa route trong ứng dụng
 * Giúp dễ dàng quản lý, thay đổi và bảo trì các đường dẫn
 */

export const APP_ROUTES = {
  /**
   * Các route công khai không yêu cầu xác thực
   */
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
    ABOUT: "/about",
    CONTACT: "/contact",
    TERMS: "/terms",
    PRIVACY: "/privacy",
    LANDING: "/landing",
    ERROR_404: "/404",
    ERROR_500: "/500",
  },

  /**
   * Các route yêu cầu xác thực
   */
  PRIVATE: {
    DASHBOARD: "/",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    NOTIFICATIONS: "/notifications",
  },

  /**
   * Các route cho admin
   */
  ADMIN: {
    DASHBOARD: "/admin",
    USERS: "/admin/users",
    USER_DETAIL: "/admin/users/:id",
    SETTINGS: "/admin/settings",
    LOGS: "/admin/logs",
  },

  /**
   * Các route cho tính năng chat
   */
  CHAT: {
    INDEX: "/chat",
    CONVERSATION: "/chat/:id",
    NEW: "/chat/new",
  },

  /**
   * Các route cho tính năng bệnh
   */
  DISEASE: {
    LIST: "/diseases",
    DETAIL: "/diseases/:id",
    PREDICT: "/predict",
    HISTORY: "/predict/history",
  },

  /**
   * Các route cho doctor
   */
  DOCTOR: {
    INDEX: "/",
    DASHBOARD: "/doctor/dashboard",
    DIAGNOSE_DISEASES: "/doctor/diagnose-diseases",
    DIAGNOSE_DISEASES_DETAILS: "/doctor/diagnose-diseases/:id",
  },
};

/**
 * Tạo path với params
 * @param path Path gốc
 * @param params Object chứa các tham số
 * @returns Path đã được thay thế params
 *
 * @example
 * createPath('/users/:id', { id: 123 }) => '/users/123'
 */
export function createPath(
  path: string,
  params: Record<string, string | number>
): string {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
}
