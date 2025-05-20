import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  setUser,
  clearError,
} from "../features/auth/redux/authSlice";
import { LoginPayload, RegisterPayload, User } from "../features/auth/types";
import { APP_ROUTES } from "../constants/routeConstants";

/**
 * Custom hook cho việc quản lý xác thực
 */
export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  /**
   * Đăng nhập người dùng
   */
  const login = useCallback(
    async (credentials: LoginPayload, redirectPath?: string) => {
      try {
        const resultAction = await dispatch(loginAction(credentials));

        if (loginAction.fulfilled.match(resultAction)) {
          // Chuyển hướng sau khi đăng nhập thành công
          navigate(redirectPath || APP_ROUTES.PRIVATE.DASHBOARD);
          return true;
        }

        return false;
      } catch (error) {
        return false;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Đăng ký người dùng mới
   */
  const register = useCallback(
    async (userData: RegisterPayload, redirectToLogin = true) => {
      try {
        const resultAction = await dispatch(registerAction(userData));

        if (registerAction.fulfilled.match(resultAction)) {
          if (redirectToLogin) {
            navigate(APP_ROUTES.PUBLIC.LOGIN);
          }
          return true;
        }

        return false;
      } catch (error) {
        return false;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Đăng xuất người dùng
   */
  const logout = useCallback(() => {
    dispatch(logoutAction());
    navigate(APP_ROUTES.PUBLIC.LOGIN);
  }, [dispatch, navigate]);

  /**
   * Cập nhật thông tin người dùng
   */
  const updateUserProfile = useCallback(
    (userData: Partial<User>) => {
      if (auth.user) {
        const updatedUser = { ...auth.user, ...userData };
        dispatch(setUser(updatedUser));
      }
    },
    [auth.user, dispatch]
  );

  /**
   * Kiểm tra người dùng có quyền cụ thể không
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!auth.user || !auth.user.roles) {
        return false;
      }

      return auth.user.roles.some((role) =>
        role.permissions.some((p) => p.name === permission)
      );
    },
    [auth.user]
  );

  /**
   * Kiểm tra người dùng có vai trò cụ thể không
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!auth.user || !auth.user.roles) {
        return false;
      }

      return auth.user.roles.some((r) => r.name === role);
    },
    [auth.user]
  );

  /**
   * Xóa thông báo lỗi
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...auth,
    login,
    register,
    logout,
    updateUserProfile,
    hasPermission,
    hasRole,
    clearAuthError,
  };
};
