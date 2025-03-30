import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated but doesn't have the required role
    if (
      isAuthenticated &&
      user &&
      requiredRole &&
      !user.role.includes(requiredRole)
    ) {
      // Redirect based on role
      if (user.role.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/chatbot");
      }
    }
  }, [isAuthenticated, user, requiredRole, navigate]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // If role is required and user doesn't have it, show nothing while the useEffect handles redirection
  if (requiredRole && user && !user.role.includes(requiredRole)) {
    return null;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
