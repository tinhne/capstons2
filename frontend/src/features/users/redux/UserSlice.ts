import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserProfile, UserState } from "../types";
import { fetchMyInfo, updateUserInfo } from "../services/userService";

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// Tạo async thunk để gọi API getMyInfo từ service
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Gọi service thay vì trực tiếp gọi API
      return await fetchMyInfo();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thêm async thunk cho việc cập nhật thông tin user
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      // Gọi service để cập nhật
      return await updateUserInfo(userData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
    },
    updateUserField: (state, action) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Xử lý cases cho updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserProfile, updateUserField } = userSlice.actions;
export default userSlice.reducer;