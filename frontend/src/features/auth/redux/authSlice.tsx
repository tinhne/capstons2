import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, User, TokenPayload } from "../types";
import {
  login,
  saveAuthToken,
  decodeToken,
  removeAuthToken,
  getAuthToken,
  logoutApi,
} from "../services/authService";
import { fetchMyInfo } from "../../users/services/userService";

const initialState: AuthState = {
  user: null,
  token: getAuthToken(),
  isAuthenticated: !!getAuthToken(),
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await login(email, password);

      if (response.status !== 1000 || !response.data.authenticated) {
        return rejectWithValue("Login failed: Invalid credentials");
      }

      const token = response.data.token;
      saveAuthToken(token);

      try {
        // Get user info after successful login
        const userInfo = await fetchMyInfo();

        // Decode token to get role information
        const decodedToken = decodeToken(token);

        // Create a valid User object with required fields
        const user: User = {
          id: userInfo.id || "",
          email: userInfo.email || "",
          name: userInfo.name || "", // Provide a default empty string
          role: decodedToken?.scope || "",
          // Add other optional fields
          age: userInfo.age,
          gender: userInfo.gender,
          address: userInfo.address,
          district: userInfo.district,
          city: userInfo.city,
          // ... other optional fields
        };

        return {
          token,
          user,
        };
      } catch (error) {
        // If we can't get user info, at least create a minimal user from token
        const decodedToken = decodeToken(token);

        if (!decodedToken) {
          throw new Error("Invalid token");
        }

        // Create a minimal User object from token data
        const minimalUser: User = {
          id: "temp-id", // Temporary ID
          email: decodedToken.sub,
          role: decodedToken.scope,
          name: "", // Empty string as default
        };

        return {
          token,
          user: minimalUser,
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Add a new async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeAuthToken();
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cases for logout thunk
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if the API call fails, we should still logout the user on the client side
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        // We can still set an error to show a notification if needed
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
