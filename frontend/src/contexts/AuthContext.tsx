import React, {
  createContext,
  useEffect,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setToken,
  setRefreshToken,
  setUser,
} from "../features/auth/redux/authSlice";
import apiClient from "../utils/apiClient";
import { USER_API, AUTH_API } from "../constants/apiConstants";
import { User } from "../features/auth/types";
import { RootState } from "../redux/store";

// Định nghĩa kiểu cho context
type AuthContextType = {
  loading: boolean;
  checkingAuth: boolean;
  initializeAuth: () => Promise<void>;
};

// Tạo context với giá trị mặc định
export const AuthContext = createContext<AuthContextType>({
  loading: false,
  checkingAuth: true,
  initializeAuth: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);

  /**
   * Lấy thông tin người dùng hiện tại
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      // Use the ME endpoint instead of GET_ALL for fetching current user
      const response = await apiClient.get(USER_API.ME);

      console.log("User data response:", response);

      if (response.status === 1000 && response.data) {
        dispatch(setUser(response.data as User));
        return response.data;
      } else if (response.data && typeof response.data === "object") {
        // Fallback if the response structure is different than expected
        dispatch(setUser(response.data as User));
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Khởi tạo xác thực từ token đã lưu
   */
  const initializeAuth = useCallback(async () => {
    setCheckingAuth(true);

    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token) {
      dispatch(setToken(token));

      if (refreshToken) {
        dispatch(setRefreshToken(refreshToken));
      }

      // Nếu có token nhưng chưa có thông tin user, lấy thông tin
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
        // Nếu không lấy được thông tin user, xóa token
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    }

    setCheckingAuth(false);
  }, [dispatch, fetchCurrentUser]);

  // Chạy một lần khi component được mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Lấy thông tin người dùng mỗi khi trạng thái xác thực thay đổi
  useEffect(() => {
    if (isAuthenticated && !checkingAuth) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, checkingAuth, fetchCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        checkingAuth,
        initializeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
