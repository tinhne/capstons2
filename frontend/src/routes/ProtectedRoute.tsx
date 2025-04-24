import React, { ReactNode, useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../contexts/AuthContext";
import { APP_ROUTES } from "../constants/routeConstants";
import { UserRole } from "../types/user";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | string;
  requiredPermission?: string;
  redirectPath?: string;
}

/**
 * Component bảo vệ các route yêu cầu xác thực
 * @param children Các component con
 * @param requiredRole Vai trò yêu cầu (tùy chọn)
 * @param requiredPermission Quyền hạn yêu cầu (tùy chọn)
 * @param redirectPath Đường dẫn chuyển hướng nếu không có quyền
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  redirectPath = APP_ROUTES.PUBLIC.LOGIN,
}) => {
  const { isAuthenticated, user, hasRole, hasPermission } = useAuth();
  const { checkingAuth } = useContext(AuthContext);
  const location = useLocation();

  // For debugging
  console.log("Protected Route:", {
    isAuthenticated,
    hasUser: !!user,
    checkingAuth,
    path: location.pathname,
  });
  console.log("ProtectedRoute rendering with children:", !!children);

  // Kiểm tra role/permission khi user thay đổi
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      ((requiredRole && !hasRole(requiredRole)) ||
        (requiredPermission && !hasPermission(requiredPermission)))
    ) {
      console.warn(`Người dùng không có quyền truy cập: ${location.pathname}`);
    }
  }, [
    isAuthenticated,
    user,
    requiredRole,
    requiredPermission,
    hasRole,
    hasPermission,
    location.pathname,
  ]);

  // Đợi quá trình kiểm tra xác thực hoàn tất
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Đang xác thực...</p>
      </div>
    );
  }

  // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return (
      <Navigate to={redirectPath} state={{ from: location.pathname }} replace />
    );
  }

  // Nếu có yêu cầu về vai trò và người dùng không có vai trò đó
  if (requiredRole && user && !hasRole(requiredRole)) {
    return (
      <Navigate
        to={APP_ROUTES.PRIVATE.DASHBOARD}
        state={{
          from: location.pathname,
          error: "Bạn không có quyền truy cập trang này",
        }}
        replace
      />
    );
  }

  // Nếu có yêu cầu về quyền hạn và người dùng không có quyền đó
  if (requiredPermission && user && !hasPermission(requiredPermission)) {
    return (
      <Navigate
        to={APP_ROUTES.PRIVATE.DASHBOARD}
        state={{
          from: location.pathname,
          error: "Bạn không có quyền thực hiện hành động này",
        }}
        replace
      />
    );
  }

  // Nếu đã đăng nhập và có đủ quyền, hiển thị nội dung
  return <>{children}</>;
};

export default ProtectedRoute;
