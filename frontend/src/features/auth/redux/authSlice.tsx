import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoginCredentials, User } from "../types";
import * as authService from "../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  roles: string[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  roles: [],
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      const result = await authService.login(credentials);
      localStorage.setItem("token", result.token);

      // Xác định tất cả roles từ user.roles
      let roles: string[] = [];
      if (result.user?.roles && result.user.roles.length > 0) {
        roles = result.user.roles.map((role) => role.name);
      }

      return { ...result, roles };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  // Không cần xóa role từ localStorage vì không lưu ở đó
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            token: string;
            roles: string[];
          }>
        ) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.roles = action.payload.roles;
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.roles = [];
      });
  },
});

export default authSlice.reducer;
