/**
 * Thông tin người dùng
 */
export interface User {
  /**
   * ID người dùng
   */
  id: string;

  /**
   * Tên hiển thị
   */
  fullName: string;

  /**
   * Email
   */
  email: string;

  /**
   * Vai trò người dùng
   */
  role: UserRole;

  /**
   * Avatar URL
   */
  avatarUrl?: string;

  /**
   * Ngày tạo
   */
  createdAt: string;

  /**
   * Ngày cập nhật
   */
  updatedAt: string;
}

/**
 * Các vai trò người dùng
 */
export enum UserRole {
  /**
   * Quản trị viên
   */
  ADMIN = "ADMIN",

  /**
   * Người dùng thường
   */
  USER = "USER",

  /**
   * Bác sĩ
   */
  DOCTOR = "DOCTOR",
}

/**
 * Thông tin người dùng mở rộng
 */
export interface UserProfile extends User {
  /**
   * Số điện thoại
   */
  phone?: string;

  /**
   * Địa chỉ
   */
  address?: string;

  /**
   * Ngày sinh
   */
  birthday?: string;

  /**
   * Giới tính
   */
  gender?: "male" | "female" | "other";

  /**
   * Thông tin bổ sung
   */
  metadata?: Record<string, any>;
}

/**
 * Dữ liệu đăng nhập
 */
export interface LoginData {
  /**
   * Email đăng nhập
   */
  email: string;

  /**
   * Mật khẩu
   */
  password: string;
}

/**
 * Dữ liệu đăng ký
 */
export interface RegisterData {
  /**
   * Email
   */
  email: string;

  /**
   * Tên đầy đủ
   */
  fullName: string;

  /**
   * Mật khẩu
   */
  password: string;

  /**
   * Xác nhận mật khẩu
   */
  confirmPassword: string;
}
