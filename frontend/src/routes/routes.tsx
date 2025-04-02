import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashBoardLayout from "../layouts/DashBoardLayout";
import ProtectedRoute from "./ProtectedRoute";

// Import các trang từ features
import AuthPage from "../features/auth/AuthPage";
import ChatPage from "../features/chat/ChatPage";
import AdminPage from "../features/admin/AdminPage";
// import NotFoundPage from "../features/not-found/NotFoundPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/user/chatbot" replace />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        {/* User routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/user/chatbot"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/chatbot/:id"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/user/chatbot" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
