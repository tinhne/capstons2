import apiClient from "../../../utils/apiClient";
import { ApiResponse, UserProfile } from "../types";

// Helper function để lấy token từ localStorage
const getAuthHeader = (): { Authorization: string } | undefined => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

/**
 * Hàm lấy thông tin người dùng hiện tại
 */
export const fetchMyInfo = async (): Promise<UserProfile> => {
  try {
    const headers = getAuthHeader();
    if (!headers) {
      throw new Error("Không có token xác thực");
    }

    const response = await apiClient.get<ApiResponse<UserProfile>>(
      "/api/users/myinfo",
      {
        headers,
      }
    );

    if (response.data.status !== 1000) {
      throw new Error(
        response.data.message || "Không thể tải thông tin người dùng"
      );
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user info:", error);

    // Check for specific error types to provide more detailed messages
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      throw new Error(
        error.response.data?.message ||
          `Lỗi khi tải thông tin người dùng (${error.response.status})`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("Không nhận được phản hồi từ máy chủ");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
      throw new Error(`Lỗi khi tải thông tin người dùng: ${error.message}`);
    }
  }
};

/**
 * Hàm cập nhật thông tin người dùng
 */
export const updateUserInfo = async (
  userData: Partial<UserProfile>
): Promise<UserProfile> => {
  const headers = getAuthHeader();
  if (!headers) {
    throw new Error("Không có token xác thực");
  }

  const response = await apiClient.put<ApiResponse<UserProfile>>(
    "/api/users/update",
    userData,
    {
      headers,
    }
  );

  if (response.data.status !== 1000) {
    throw new Error(
      response.data.message || "Không thể cập nhật thông tin người dùng"
    );
  }

  return response.data.data;
};

/**
 * Hàm lấy thông tin người dùng bằng ID
 */
export const fetchUserById = async (userId: string): Promise<UserProfile> => {
  const headers = getAuthHeader();
  if (!headers) {
    throw new Error("Không có token xác thực");
  }

  const response = await apiClient.get<ApiResponse<UserProfile>>(
    `/api/users/${userId}`,
    {
      headers,
    }
  );

  if (response.data.status !== 1000) {
    throw new Error(
      response.data.message || "Không thể tải thông tin người dùng"
    );
  }

  return response.data.data;
};
