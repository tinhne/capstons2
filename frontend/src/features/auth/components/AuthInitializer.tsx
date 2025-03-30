import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { getAuthToken, decodeToken } from "../services/authService";
import { logout, setUser } from "../redux/authSlice";
import { fetchMyInfo } from "../../users/services/userService";
import { User } from "../types";

const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();

      if (!token) {
        return;
      }

      try {
        // Check if token is expired
        const decodedToken = decodeToken(token);

        if (!decodedToken) {
          throw new Error("Invalid token");
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          throw new Error("Token expired");
        }

        try {
          // Fetch user info
          const userInfo = await fetchMyInfo();

          // Create properly typed user object
          const user: User = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name || "", // Use empty string as fallback
            role: decodedToken.scope,
            // Copy other properties that exist
            ...(userInfo.age && { age: userInfo.age }),
            ...(userInfo.gender && { gender: userInfo.gender }),
            ...(userInfo.address && { address: userInfo.address }),
            // ...other properties
          };

          // Set user and token in redux store
          dispatch(setUser({ user, token }));
        } catch (error) {
          // If user info fetch fails, create minimal user from token
          const minimalUser: User = {
            id: "temp-id",
            email: decodedToken.sub,
            name: "",
            role: decodedToken.scope,
          };

          dispatch(setUser({ user: minimalUser, token }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch(logout());
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
