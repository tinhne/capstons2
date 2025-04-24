// Định nghĩa kiểu dữ liệu cho Permission
export interface Permission {
  name: string;
  description: string;
}

// Định nghĩa kiểu dữ liệu cho Role
export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

// Định nghĩa kiểu dữ liệu cho User
export interface UserProfile {
  id: string;
  email: string;
  name?: string; // Make name optional to match API response
  age?: number;
  gender?: string;
  address?: string;
  district?: string;
  city?: string;
  phone?: string;
  avatar?: string;
  status?: string;
  createdAt?: string;
  roles?: Role[];
  specialization?: string;
  // Giữ lại các trường cũ nhưng đánh dấu là optional
  // Add any other fields that may come from the API
}

// Định nghĩa trạng thái cho UserSlice
export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Generic API Response
export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
}
