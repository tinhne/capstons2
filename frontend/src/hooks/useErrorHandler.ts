import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  handleApiError,
  isAuthenticationError,
  ProcessedError,
} from "../utils/errorUtils";
import { APP_ROUTES } from "../constants/routeConstants";
import { useToast } from "../contexts/ToastContext";

/**
 * Options cho hook useErrorHandler
 */
interface ErrorHandlerOptions {
  /**
   * Có tự động hiển thị toast khi có lỗi hay không
   */
  showToast?: boolean;

  /**
   * Có tự động chuyển hướng khi lỗi xác thực hay không
   */
  redirectOnAuthError?: boolean;
}

/**
 * Hook xử lý lỗi API một cách nhất quán
 */
export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { showToast = true, redirectOnAuthError = true } = options;

  const navigate = useNavigate();
  const { showToast: displayToast } = useToast();

  /**
   * Xử lý lỗi từ API
   */
  const handleError = useCallback(
    (error: unknown): ProcessedError => {
      // Xử lý error thành dạng chuẩn hóa
      const processedError = handleApiError(error);

      // Nếu là lỗi xác thực và cấu hình cho phép chuyển hướng
      if (processedError.isAuthError && redirectOnAuthError) {
        // Xóa token và chuyển người dùng về trang đăng nhập
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate(APP_ROUTES.PUBLIC.LOGIN, {
          state: { from: window.location.pathname },
        });
      }

      // Hiển thị toast nếu cấu hình cho phép
      if (showToast) {
        displayToast({
          message: processedError.message,
          type: "error",
          position: "top-right",
          autoClose: 5000,
        });
      }

      return processedError;
    },
    [navigate, displayToast, showToast, redirectOnAuthError]
  );

  /**
   * Xử lý lỗi trong hàm async
   */
  const withErrorHandling = useCallback(
    async <T extends any[]>(fn: (...args: T) => Promise<any>, ...args: T) => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError]
  );

  /**
   * Kiểm tra lỗi xác thực
   */
  const isAuthError = useCallback((error: unknown): boolean => {
    return isAuthenticationError(error);
  }, []);

  return {
    handleError,
    withErrorHandling,
    isAuthError,
  };
};
