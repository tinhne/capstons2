import type { Role } from "../../types/api";

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
  status?: string;
  roles?: Role[];
  underlying_disease?: string;
  specialization?: string;
}
export interface CreateUser {
  name?: string;
  email: string;
  password: string;
  age?: number;
  gender?: string;
  address?: string;
  district?: string;
  city?: string;
  underlying_disease?: string;
  specialization?: string;
}
export interface UserProfileUpdate {
  id?: string;
  name?: string;
  email: string;
  age?: number;
  gender?: string;
  address?: string;
  district?: string;
  city?: string;
  underlying_disease?: string;
  specialization?: string;
}

// Định nghĩa trạng thái cho UserSlice
export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}
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
