import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/store";
import { logoutUser } from "../features/auth/redux/authSlice";

export const useAuth = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const logout = async (redirectTo = "/auth") => {
    await dispatch(logoutUser());
    navigate(redirectTo);
  };

  const isAdmin = authState.user?.role === "ROLE_ADMIN";
  const isAuthenticated = authState.isAuthenticated;

  return {
    ...authState,
    logout,
    isAdmin,
    isAuthenticated,
  };
};
