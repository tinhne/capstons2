import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAuth";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/auth",
}: ProtectedRouteProps) {
  const token = useAppSelector((state) => state.auth.token);
  return token ? children : <Navigate to={redirectTo} replace />;
}
