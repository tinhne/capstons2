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
    
    const response = await apiClient.get<ApiResponse<UserProfile>>("/api/users/myinfo", {
      headers
    });
    
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Không thể tải thông tin người dùng");
    }
    
    return response.data.result;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Lỗi khi tải thông tin người dùng");
  }
};

/**
 * Hàm cập nhật thông tin người dùng
 */
export const updateUserInfo = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
  const headers = getAuthHeader();
  if (!headers) {
    throw new Error("Không có token xác thực");
  }
  
  const response = await apiClient.put<ApiResponse<UserProfile>>("/api/users/update", userData, {
    headers
  });
  
  if (response.data.code !== 1000) {
    throw new Error(response.data.message || "Không thể cập nhật thông tin người dùng");
  }
  
  return response.data.result;
};

/**
 * Hàm lấy thông tin người dùng bằng ID
 */
export const fetchUserById = async (userId: string): Promise<UserProfile> => {
  const headers = getAuthHeader();
  if (!headers) {
    throw new Error("Không có token xác thực");
  }
  
  const response = await apiClient.get<ApiResponse<UserProfile>>(`/api/users/${userId}`, {
    headers
  });
  
  if (response.data.code !== 1000) {
    throw new Error(response.data.message || "Không thể tải thông tin người dùng");
  }
  
  return response.data.result;
};