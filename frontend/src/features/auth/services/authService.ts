import apiClient from "../../../utils/apiClient";
import {
  ApiResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  RefreshTokenResponse,
} from "../types";
import { AUTH_API, API_STATUS_CODES } from "../../../constants/apiConstants";
import { handleApiError, showErrorToast } from "../../../utils/errorUtils";

/**
 * Service class quản lý các operations liên quan đến xác thực
 */
class AuthService {
  /**
   * Đăng nhập người dùng
   * @param credentials Thông tin đăng nhập
   * @returns Promise với kết quả đăng nhập
   */
  async login(credentials: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<any>(AUTH_API.LOGIN, credentials);
      console.log("Raw login response:", response);

      // Handle different response formats
      let formattedResponse: LoginResponse;

      // Backend directly returns AuthenticationResponse object
      if (response && typeof response === "object") {
        // Check if the response has token and user properties directly
        if (response.token && response.authenticated) {
          formattedResponse = {
            status: API_STATUS_CODES.SUCCESS,
            data: {
              token: response.token,
              refreshToken: response.refreshToken,
              expiresIn: response.expiresIn,
              authenticated: response.authenticated,
              user: response.user,
            },
          };
        }
        // Check if the response has data property that contains these fields
        else if (response.data && response.data.token) {
          formattedResponse = {
            status: response.status || API_STATUS_CODES.SUCCESS,
            message: response.message || "Login successful",
            data: response.data,
          };
        }
        // Backend wrapped response in ApiResponse format
        else if (response.status && response.data) {
          formattedResponse = response as LoginResponse;
        } else {
          throw new Error("Unexpected response format");
        }
      } else {
        throw new Error("Invalid response from server");
      }

      console.log("Formatted login response:", formattedResponse);
      return formattedResponse;
    } catch (error) {
      console.error("Login error:", error);
      const processedError = handleApiError(error);
      throw new Error(processedError.message);
    }
  }

  /**
   * Đăng ký tài khoản mới
   * @param userData Thông tin đăng ký
   * @returns Promise với kết quả đăng ký
   */
  async register(userData: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        AUTH_API.REGISTER,
        userData
      );

      if (response.status !== API_STATUS_CODES.SUCCESS) {
        throw new Error(response.message || "Đăng ký thất bại");
      }

      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      const processedError = handleApiError(error);
      throw new Error(processedError.message);
    }
  }

  /**
   * Đăng xuất người dùng
   * @returns Promise với kết quả đăng xuất
   */
  async logout(token: string): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>(
        AUTH_API.LOGOUT,
        token
      );

      return response.status === API_STATUS_CODES.SUCCESS;
    } catch (error) {
      console.error("Logout error:", error);
      // Đăng xuất luôn trả về true - người dùng nên được đăng xuất kể cả khi có lỗi
      return true;
    }
  }

  /**
   * Làm mới token
   * @param token Refresh token
   * @returns Promise với token mới
   */
  async refreshToken(token: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post(AUTH_API.REFRESH_TOKEN, {
        refreshToken: token,
      });

      console.log("Raw refresh token response:", response);

      // Handle different response formats similarly to login
      let formattedResponse: RefreshTokenResponse;

      if (response && typeof response === "object") {
        if (response.token) {
          formattedResponse = {
            token: response.token,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
            success: true,
            data: response.user,
          };
        } else if (response.data && response.data.token) {
          formattedResponse = {
            ...response.data,
            success: true,
          };
        } else {
          throw new Error("Unexpected response format");
        }
      } else {
        throw new Error("Invalid response from server");
      }

      return formattedResponse;
    } catch (error) {
      console.error("Refresh token error:", error);
      const processedError = handleApiError(error);
      throw new Error(processedError.message);
    }
  }

  /**
   * Quên mật khẩu
   * @param email Email người dùng
   * @returns Promise với kết quả gửi email
   */
  async forgotPassword(email: string): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>(
        AUTH_API.FORGOT_PASSWORD,
        { email }
      );

      return response.status === API_STATUS_CODES.SUCCESS;
    } catch (error) {
      console.error("Forgot password error:", error);
      const processedError = handleApiError(error);
      throw new Error(processedError.message);
    }
  }

  /**
   * Đặt lại mật khẩu
   * @param token Token đặt lại mật khẩu
   * @param newPassword Mật khẩu mới
   * @returns Promise với kết quả đặt lại mật khẩu
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>(
        AUTH_API.RESET_PASSWORD,
        { token, newPassword }
      );

      return response.status === API_STATUS_CODES.SUCCESS;
    } catch (error) {
      console.error("Reset password error:", error);
      const processedError = handleApiError(error);
      throw new Error(processedError.message);
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;

// Export các hàm riêng lẻ để tương thích ngược với mã cũ
export const login = (credentials: LoginPayload) =>
  authService.login(credentials);
export const register = (userData: RegisterPayload) =>
  authService.register(userData);
export const logout = (token: string) => authService.logout(token);
export const refreshToken = (token: string) => authService.refreshToken(token);
export const forgotPassword = (email: string) =>
  authService.forgotPassword(email);
export const resetPassword = (token: string, newPassword: string) =>
  authService.resetPassword(token, newPassword);
