import apiClient from "../../../utils/apiClient";
import { ApiResponse, UserProfile } from "../types";

/**
 * Service class quản lý các operations liên quan đến người dùng
 */
class UserService {
  /**
   * Hàm lấy thông tin người dùng hiện tại
   * @returns Promise<UserProfile> thông tin người dùng
   */
  async fetchMyInfo(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>(
        "/api/users/myinfo"
      );

      if (response.status !== 1000) {
        throw new Error(
          response.message || "Không thể tải thông tin người dùng"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("Error fetching user info:", error);

      // Chi tiết hóa thông báo lỗi để dễ dàng debug
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(
          error.response.data?.message ||
            `Lỗi khi tải thông tin người dùng (${error.response.status})`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error("Không nhận được phản hồi từ máy chủ");
      } else {
        console.error("Error message:", error.message);
        throw new Error(`Lỗi khi tải thông tin người dùng: ${error.message}`);
      }
    }
  }

  /**
   * Hàm cập nhật thông tin người dùng
   * @param userData thông tin người dùng cần cập nhật
   * @returns Promise<UserProfile> thông tin người dùng đã cập nhật
   */
  async updateUserInfo(userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put<ApiResponse<UserProfile>>(
        "/api/users/update",
        userData
      );

      if (response.status !== 1000) {
        throw new Error(
          response.message || "Không thể cập nhật thông tin người dùng"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("Error updating user info:", error);

      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Lỗi khi cập nhật thông tin người dùng (${error.response.status})`
        );
      }

      throw new Error(
        `Lỗi khi cập nhật thông tin người dùng: ${error.message}`
      );
    }
  }

  /**
   * Hàm lấy thông tin người dùng bằng ID
   * @param userId ID của người dùng cần lấy thông tin
   * @returns Promise<UserProfile> thông tin người dùng
   */
  async fetchUserById(userId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>(
        `/api/users/${userId}`
      );

      if (response.status !== 1000) {
        throw new Error(
          response.message || "Không thể tải thông tin người dùng"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching user with ID ${userId}:`, error);

      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Lỗi khi tải thông tin người dùng (${error.response.status})`
        );
      }

      throw new Error(`Lỗi khi tải thông tin người dùng: ${error.message}`);
    }
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;

// Export các hàm riêng lẻ để tương thích ngược với mã cũ
export const fetchMyInfo = () => userService.fetchMyInfo();
export const updateUserInfo = (userData: Partial<UserProfile>) =>
  userService.updateUserInfo(userData);
export const fetchUserById = (userId: string) =>
  userService.fetchUserById(userId);
