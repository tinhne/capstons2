import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginPayload, RegisterPayload, User } from "../types";
import * as authService from "../services/authService";

// Khởi tạo state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      console.log("Attempting login with credentials:", {
        email: credentials.email,
        passwordLength: credentials.password?.length,
      });
      const response = await authService.login(credentials);
      console.log("Login API response:", response);
      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const token = auth.token;
      if (token) {
        authService.logout(token); // Gọi API logout và truyền token
      }
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng ký thất bại");
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const refreshTokenValue = auth.refreshToken;

      if (!refreshTokenValue) {
        throw new Error("Không có refresh token");
      }

      const response = await authService.refreshToken(refreshTokenValue);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Làm mới token thất bại");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      localStorage.setItem("refreshToken", action.payload);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Xử lý login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Login fulfilled with payload:", action.payload);
        state.loading = false;

        // Handle different response structures
        if (action.payload && action.payload.data) {
          // Standard API response format
          const responseData = action.payload.data;

          state.isAuthenticated = true;
          state.token = responseData.token;

          if (responseData.user) {
            console.log("Setting user data:", responseData.user);
            state.user = responseData.user;
          }

          if (responseData.refreshToken) {
            state.refreshToken = responseData.refreshToken;
            localStorage.setItem("refreshToken", responseData.refreshToken);
          }

          localStorage.setItem("token", responseData.token);
          console.log("Authentication state after login:", {
            isAuthenticated: state.isAuthenticated,
            hasToken: !!state.token,
            hasUser: !!state.user,
          });
        } else {
          // Unexpected response format
          console.error("Unexpected login response format:", action.payload);
          state.error = "Unexpected login response format";
        }
      })
      .addCase(login.rejected, (state, action) => {
        console.error("Login rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // Không cần set authenticated vì user vẫn cần đăng nhập sau khi đăng ký
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý refresh token
      .addCase(refreshUserToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);

        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Token refresh thất bại nên nên đăng xuất
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setToken, setRefreshToken, setUser, clearError } =
  authSlice.actions;

export default authSlice.reducer;
