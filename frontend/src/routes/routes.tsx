import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashBoardLayout from "../layouts/DashBoardLayout";

// Import các trang từ features
import AuthPage from "../features/auth/AuthPage";
import ChatPage from "../features/chat/Chatbot";
import AdminPage from "../features/admin/AdminPage";
import ProtectedRoute from "./ProtectedRoute";
// import NotFoundPage from "../features/not-found/NotFoundPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Root route - chuyển hướng đến trang chính hoặc trang login */}
        <Route path="/" element={<Navigate to="/user/chatbot" replace />} />
        {/* Public Routes - sử dụng AuthRoute để kiểm tra đã đăng nhập chưa */}
        <Route element={<AuthLayout />}>
          {/* Thêm AuthRoute ở đây */}
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        {/* Protected Routes - cần đăng nhập */}
        <Route element={<MainLayout />}>
          <Route
            element={
              <ProtectedRoute>
                <>
                  <Route path="/user/chatbot" element={<ChatPage />} />
                  <Route path="/user/chatbot/:id" element={<ChatPage />} />
                  {/* Thêm các route cần bảo vệ khác ở đây */}
                </>
              </ProtectedRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <Route path="/admin/dashboard" element={<AdminPage />} />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
