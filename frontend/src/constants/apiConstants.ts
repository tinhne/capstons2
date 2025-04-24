/**
 * Tất cả các endpoint API trong ứng dụng
 * Giúp dễ dàng quản lý và bảo trì các API endpoint
 */

/**
 * API endpoint cơ bản
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * API endpoints cho xác thực
 */
export const AUTH_API = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
};

/**
 * API endpoints cho quản lý người dùng
 */
export const USER_API = {
  GET_ALL: "/users",
  GET_ONE: (id: string | number) => `/users/${id}`,
  CREATE: "/users",
  UPDATE: (id: string | number) => `/users/${id}`,
  DELETE: (id: string | number) => `/users/${id}`,
  UPDATE_AVATAR: (id: string | number) => `/users/${id}/avatar`,
  CHANGE_PASSWORD: (id: string | number) => `/users/${id}/change-password`,
  ME: "/users/me",
};

/**
 * API endpoints cho tính năng chat
 */
export const CHAT_API = {
  GET_CONVERSATIONS: "/chat/conversations",
  GET_CONVERSATION: (id: string | number) => `/chat/conversations/${id}`,
  CREATE_CONVERSATION: "/chat/conversations",
  DELETE_CONVERSATION: (id: string | number) => `/chat/conversations/${id}`,
  GET_MESSAGES: (conversationId: string | number) =>
    `/chat/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId: string | number) =>
    `/chat/conversations/${conversationId}/messages`,
  DELETE_MESSAGE: (
    conversationId: string | number,
    messageId: string | number
  ) => `/chat/conversations/${conversationId}/messages/${messageId}`,
  READ_MESSAGES: (conversationId: string | number) =>
    `/chat/conversations/${conversationId}/read`,
};

/**
 * API endpoints cho tính năng dự đoán bệnh
 */
export const DISEASE_API = {
  PREDICT: "/diseases/predict",
  GET_HISTORY: "/diseases/history",
  GET_DISEASE: (id: string | number) => `/diseases/${id}`,
  GET_ALL_DISEASES: "/diseases",
  GET_SYMPTOMS: "/symptoms",
};

/**
 * API endpoints cho quản lý nội dung
 */
export const CONTENT_API = {
  GET_ARTICLES: "/articles",
  GET_ARTICLE: (id: string | number) => `/articles/${id}`,
  CREATE_ARTICLE: "/articles",
  UPDATE_ARTICLE: (id: string | number) => `/articles/${id}`,
  DELETE_ARTICLE: (id: string | number) => `/articles/${id}`,
};

/**
 * API endpoints cho tính năng thông báo
 */
export const NOTIFICATION_API = {
  GET_ALL: "/notifications",
  MARK_AS_READ: (id: string | number) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: "/notifications/read-all",
  GET_UNREAD_COUNT: "/notifications/unread-count",
};

/**
 * Các hằng số cho API pagination
 */
export const API_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_SORT_BY: "createdAt",
  DEFAULT_SORT_ORDER: "desc",
};

/**
 * Các mã trạng thái API
 */
export const API_STATUS_CODES = {
  SUCCESS: 1000,
  VALIDATION_ERROR: 1001,
  AUTHENTICATION_ERROR: 1002,
  AUTHORIZATION_ERROR: 1003,
  RESOURCE_NOT_FOUND: 1004,
  INTERNAL_SERVER_ERROR: 1005,
  BAD_REQUEST: 1006,
};

/**
 * Các thông báo lỗi mặc định
 */
export const DEFAULT_ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn.",
  SERVER_ERROR: "Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.",
  AUTHENTICATION_ERROR:
    "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.",
  AUTHORIZATION_ERROR: "Bạn không có quyền thực hiện hành động này.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
  RESOURCE_NOT_FOUND: "Không tìm thấy tài nguyên yêu cầu.",
};
