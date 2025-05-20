import { ApiResponse } from "../../../types/api";
import apiClient from "../../../utils/apiClient";
import { CreateUser, UserProfile, UserProfileUpdate } from "../types";

/**
 * Service class managing user-related operations
 */
class UserService {
  /**
   * Fetch current user info
   * @returns Promise<UserProfile> user info
   */
  async fetchMyInfo(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>(
        "/users/me"
      );

      if (response.status !== 1000) {
        throw new Error(response.message || "Unable to load user information");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error fetching user info:", error);

      // Detailed error message for easier debugging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(
          error.response.data?.message ||
            `Error loading user information (${error.response.status})`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error("No response received from server");
      } else {
        console.error("Error message:", error.message);
        throw new Error(`Error loading user information: ${error.message}`);
      }
    }
  }

  /**
   * Update user information
   * @param userData user info to update
   * @returns Promise<UserProfile> updated user info
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
          response.message || "Unable to update user information"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("Error updating user info:", error);

      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Error updating user information (${error.response.status})`
        );
      }

      throw new Error(`Error updating user information: ${error.message}`);
    }
  }

  /**
   * Fetch user info by ID
   * @param userId user ID to fetch
   * @returns Promise<UserProfile> user info
   */
  async fetchUserById(userId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>(
        `/users/${userId}`
      );

      if (response.status !== 1000) {
        throw new Error(response.message || "Unable to load user information");
      }

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching user with ID ${userId}:`, error);

      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Error loading user information (${error.response.status})`
        );
      }

      throw new Error(`Error loading user information: ${error.message}`);
    }
  }

  /**
   * Fetch all users
   */
  async fetchAllUsers(): Promise<UserProfile[]> {
    const response = await apiClient.get<ApiResponse<UserProfile[]>>("/users");
    if (response.status !== 1000) {
      throw new Error(response.message || "Unable to load user list");
    }
    return response.data;
  }

  /**
   * Fetch all doctors
   */
  async fetchAllDoctors(): Promise<UserProfile[]> {
    const response = await apiClient.get<ApiResponse<UserProfile[]>>(
      "/users/doctors"
    );
    if (response.status !== 1000) {
      throw new Error(response.message || "Unable to load doctor list");
    }
    return response.data;
  }

  /**
   * Create a new user with Doctor role
   * @param doctorData user info to create
   * @returns Promise<UserProfile> created Doctor user info
   */
  async createDoctor(doctorData: Partial<CreateUser>): Promise<CreateUser> {
    try {
      const response = await apiClient.post<ApiResponse<CreateUser>>(
        "/users/doctor",
        doctorData
      );
      if (response.status !== 1000) {
        throw new Error(response.message || "Unable to create new doctor");
      }
      return response.data;
    } catch (error: any) {
      console.error("Error creating doctor:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Error creating new doctor (${error.response.status})`
        );
      }
      throw new Error(`Error creating new doctor: ${error.message}`);
    }
  }

  /**
   * Delete user by id
   * @param userId user ID to delete
   * @returns Promise<void>
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${userId}`
      );
      if (response.status !== 1000) {
        throw new Error(response.message || "Unable to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Error deleting user (${error.response.status})`
        );
      }
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;

// Export individual functions for backward compatibility
export const fetchMyInfo = () => userService.fetchMyInfo();
export const updateUserInfo = (userData: Partial<UserProfile>) =>
  userService.updateUserInfo(userData);
export const fetchUserById = (userId: string) =>
  userService.fetchUserById(userId);
