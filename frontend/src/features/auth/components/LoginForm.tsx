import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login, logout } from "../redux/authSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { APP_ROUTES, createPath } from "../../../constants/routeConstants";
import {
  extractRolesFromToken,
  getUserIdFromToken,
  hasRoleFromToken,
} from "../../../utils/jwtUtils";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../../../contexts/ToastContext";

// SVG Google icon component
const GoogleIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    version="1.1"
    viewBox="0 0 48 48"
    enableBackground="new 0 0 48 48"
    className="h-5 w-5"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // Get redirect path from location state if available
  const redirectPath = location.state?.from || APP_ROUTES.PRIVATE.DASHBOARD;

  const { isAuthenticated, loading, error, user, token } = useSelector(
    (state: RootState) => state.auth
  );

  // console.log("Current auth state:", {
  //   isAuthenticated,
  //   hasUser: !!user,
  //   hasToken: !!token,
  //   location: location.pathname,
  //   redirectPath,
  // });
  const isTokenValid = (token: string): boolean => {
    try {
      const decodedToken: any = jwtDecode(token); // Thay đổi ở đây
      const currentTime = Date.now() / 1000;

      // Kiểm tra exp (expiration time)
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  // Effect to handle redirection based on authentication status and token
  useEffect(() => {
    if (isAuthenticated && token && !error) {
      // Decode token to get user role and ID
      if (!isTokenValid(token)) {
        // Token hết hạn, nên logout hoặc xóa token ở đây
        dispatch(logout());
        return;
      }
      const roles = extractRolesFromToken(token);
      const userId = getUserIdFromToken(token);

      console.log("Token decoded info:", {
        roles,
        userId,
        isAdmin: hasRoleFromToken(token, "ADMIN"),
      });

      // Force a small delay to ensure state is properly updated
      setTimeout(() => {
        // Check if user has admin role
        if (hasRoleFromToken(token, "ADMIN")) {
          console.log("Redirecting to admin dashboard");
          navigate(APP_ROUTES.ADMIN.DASHBOARD);
        } else {
          console.log("Redirecting to chat page");
          navigate(`/home`); // Chuyển hướng trực tiếp đến /chat
        }
      }, 100);
    }
  }, [isAuthenticated, token, error]);

  useEffect(() => {
    if (error) {
      showToast({ type: "error", message: error });
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    console.log("Submitting login form with email:", email);

    // Dispatch login action
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex flex-col justify-center items-center pb-5">
      <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:max-w-[50%] min-h-screen lg:px-6">
        <div className="my-auto mb-auto mt-8 flex flex-col w-[350px] max-w-[450px] mx-auto md:mt-[70px] lg:mt-[130px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-white">Sign In</h1>
            <p className="mt-2.5 font-normal text-zinc-400">
              Enter your email and password to sign in!
            </p>
          </div>

          {/* Google Sign-in Button */}
          <div>
            <button
              className="inline-flex items-center justify-center w-full rounded-md border border-zinc-800 bg-none text-white py-6 hover:bg-zinc-900"
              type="button"
            >
              <span className="mr-2">
                <GoogleIcon />
              </span>
              <span>Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="relative flex items-center py-1">
              <div className="grow border-t border-zinc-800"></div>
              <div className="mx-2 text-zinc-400 text-sm">or</div>
              <div className="grow border-t border-zinc-800"></div>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} noValidate className="mb-4">
            <div className="grid gap-4">
              {/* Email Field */}
              <div className="grid gap-1">
                <label className="text-white text-sm" htmlFor="email">
                  Email
                </label>
                <input
                  className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600"
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoComplete="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-1">
                <label className="text-white text-sm" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Sign in Button */}
              <button
                className="bg-white text-zinc-950 hover:bg-white/90 active:bg-white/80 mt-2 rounded-lg px-4 py-4 text-base font-medium transition-colors disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="space-y-2 mt-4 text-sm">
            <p>
              <Link
                to={APP_ROUTES.PUBLIC.FORGOT_PASSWORD}
                className="text-white hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
            <p>
              <Link
                to={APP_ROUTES.PUBLIC.REGISTER}
                className="text-white hover:underline"
              >
                Don't have an account? Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="font-normal text-white mt-8 mx-auto text-center text-sm">
        Auth component for dark mode from
        <a
          href="https://horizon-ui.com/shadcn-ui?ref=twcomponents"
          target="_blank"
          className="text-blue-400 font-medium ml-1 hover:underline"
          rel="noopener noreferrer"
        >
          Horizon AI Boilerplate
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
