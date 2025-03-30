import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";
import { AppDispatch, RootState } from "../../../redux/store";

interface LogoutButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "text";
  redirectTo?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  variant = "primary",
  redirectTo = "/auth",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  // Style classes based on variant
  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
      case "secondary":
        return "bg-white text-red-600 border border-red-600 hover:bg-red-50 font-bold py-2 px-4 rounded";
      case "text":
        return "text-red-600 hover:text-red-800 font-medium";
      default:
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(redirectTo);
  };

  return (
    <button
      className={`${getButtonClasses()} ${className} disabled:opacity-50`}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Logging out..." : "Sign out"}
    </button>
  );
};

export default LogoutButton;
