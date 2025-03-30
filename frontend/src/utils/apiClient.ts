import axios from "axios";
import { store } from "../redux/store";
import { logout, setToken } from "../features/auth/redux/authSlice";
import { refreshToken } from "../features/auth/services/authService";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const getToken = () => {
  const state = store.getState();
  return state.auth.token;
};

// Thêm interceptor cho request để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response để xử lý khi token hết hạn
apiClient.interceptors.response.use(
  (response) => response, // Nếu không có lỗi, trả về bình thường
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi là do hết hạn token (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy refresh token từ store hoặc context
        const token = getToken();

        if (token) {
          const refreshResponse = await refreshToken(token);

          if (refreshResponse.success) {
            // Lưu token mới vào Redux
            store.dispatch(setToken(refreshResponse.data.token));

            // Cập nhật lại token trong header của request cũ
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${refreshResponse.data.token}`;

            // Thực hiện lại request ban đầu
            return apiClient(originalRequest);
          }
        }
      } catch (error) {
        console.error("Token refresh failed", error);
        // Quản lý lỗi refresh token, có thể logout nếu cần
        store.dispatch(logout()); // Đảm bảo logout khi refresh thất bại
      }
    }

    // Handle 401 Unauthorized errors
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Dispatch logout action to clear auth state
      store.dispatch(logout());

      // Redirect to login page (this will happen if your app uses React Router)
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
