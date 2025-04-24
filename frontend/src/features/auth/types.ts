/**
 * Định nghĩa quyền trong hệ thống
 */
export interface Permission {
  name: string;
  description: string;
}

/**
 * Định nghĩa vai trò trong hệ thống
 */
export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

/**
 * Định nghĩa thông tin người dùng
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  age?: number;
  gender?: "male" | "female" | "other";
  address?: string;
  district?: string;
  city?: string;
  phone?: string;
  avatar?: string;
  status?: "active" | "inactive" | "pending" | "banned";
  createdAt?: string;
  updatedAt?: string;
  roles?: Role[];
}

/**
 * Định nghĩa nội dung JWT Token
 */
export interface TokenPayload {
  sub: string; // Subject (thường là user ID)
  scope: string; // Phạm vi quyền
  iss: string; // Issuer (người phát hành)
  exp: number; // Expiration time (thời gian hết hạn)
  iat: number; // Issued at (thời điểm phát hành)
  jti: string; // JWT ID (định danh token)
}

/**
 * Định nghĩa Response khi đăng nhập
 */
export interface LoginResponse {
  status: number;
  message?: string;
  data: {
    token: string;
    refreshToken?: string;
    expiresIn?: number;
    authenticated: boolean;
    user?: User;
  };
}

/**
 * Định nghĩa trạng thái Auth trong Redux store
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Định nghĩa payload đăng nhập
 */
export interface LoginPayload {
  email: string;
  password: string;
  // rememberMe?: boolean;
}

/**
 * Định nghĩa payload đăng ký
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  district?: string;
  city?: string;
  phone?: string;
  acceptTerms?: boolean;
}

/**
 * Định nghĩa Response khi đăng ký
 */
export interface RegisterResponse {
  status: number;
  message: string;
  data: {
    userId: string;
    email: string;
    name?: string;
  };
}

/**
 * Định nghĩa Response khi refresh token
 */
export interface RefreshTokenResponse {
  data: any;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  success: boolean;
}

/**
 * Định nghĩa một API Response tiêu chuẩn
 */
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}
