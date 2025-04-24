import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/redux/authSlice";
import chatReducer from "../features/chat/redux/chatSlice";
import userReducer from "../features/users/redux/UserSlice";

// Cấu hình Redux Persist cho từng slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "refreshToken"], // Chỉ lưu trữ các thuộc tính cần thiết
};

// Kết hợp tất cả các reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  chat: chatReducer,
  user: userReducer,
});

// Định nghĩa kiểu cho RootState
export type RootState = ReturnType<typeof rootReducer>;

// Cấu hình Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ["register.user"],
      },
    }),
});

// Export kiểu AppDispatch
export type AppDispatch = typeof store.dispatch;

// Tạo persisted store
export const persistor = persistStore(store);

export default store;
