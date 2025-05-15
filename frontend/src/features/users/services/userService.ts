import { ApiResponse } from "../../../types/api";
import apiClient from "../../../utils/apiClient";
import { CreateUser, UserProfile, UserProfileUpdate } from "../types";

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
        "/users/me"
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
  async updateUserInfo(
    userData: Partial<UserProfileUpdate>
  ): Promise<UserProfileUpdate> {
    try {
      const response = await apiClient.put<ApiResponse<UserProfileUpdate>>(
        `/users/${userData.id}`,
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
        `/users/${userId}`
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

  /**
   * Lấy tất cả người dùng
   */
  async fetchAllUsers(): Promise<UserProfile[]> {
    const response = await apiClient.get<ApiResponse<UserProfile[]>>("/users");
    if (response.status !== 1000) {
      throw new Error(response.message || "Không thể tải danh sách người dùng");
    }
    return response.data;
  }

  /**
   * Lấy tất cả bác sĩ
   */
  async fetchAllDoctors(): Promise<UserProfile[]> {
    const response = await apiClient.get<ApiResponse<UserProfile[]>>(
      "/users/doctors"
    );
    if (response.status !== 1000) {
      throw new Error(response.message || "Không thể tải danh sách bác sĩ");
    }
    return response.data;
  }

  /**
   * Tạo mới một user có role là Doctor
   * @param doctorData Thông tin user cần tạo
   * @returns Promise<UserProfile> thông tin user Doctor vừa tạo
   */
  async createDoctor(doctorData: Partial<CreateUser>): Promise<CreateUser> {
    try {
      const response = await apiClient.post<ApiResponse<CreateUser>>(
        "/users/doctor",
        doctorData
      );
      if (response.status !== 1000) {
        throw new Error(response.message || "Không thể tạo bác sĩ mới");
      }
      return response.data;
    } catch (error: any) {
      console.error("Error creating doctor:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Lỗi khi tạo bác sĩ mới (${error.response.status})`
        );
      }
      throw new Error(`Lỗi khi tạo bác sĩ mới: ${error.message}`);
    }
  }

  /**
   * Xóa người dùng theo id
   * @param userId ID của người dùng cần xóa
   * @returns Promise<void>
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${userId}`
      );
      if (response.status !== 1000) {
        throw new Error(response.message || "Không thể xóa người dùng");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Lỗi khi xóa người dùng (${error.response.status})`
        );
      }
      throw new Error(`Lỗi khi xóa người dùng: ${error.message}`);
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
