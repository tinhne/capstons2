import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../features/users/types";
import { NotificationBell } from "../features/notifications";
import { APP_ROUTES } from "../constants/routeConstants";
import { useNotificationSocket } from "../features/notifications";
import Toast from "../components/ui/Toast";
import { Notification as AppNotification } from "../features/notifications/types";
import { NotificationDropdown } from "../features/notifications";
import {
  fetchNotifications,
  markNotificationAsRead, // ✅ Thêm import này
} from "../features/notifications/services/notificationsServices";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<
    {
      id: string;
      message: string;
      type?: "info" | "success" | "warning" | "error";
    }[]
  >([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy notifications khi user login
  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id).then(setNotifications);
    }
  }, [user?.id]);

  // Nhận notification realtime qua websocket, cập nhật notifications
  useNotificationSocket(user?.id || "", (newNotification) => {
    setToasts((prev) => [
      ...prev,
      {
        id: newNotification.id,
        message: "Bạn có thông báo mới: " + (newNotification.title || ""),
        type: "info",
      },
    ]);
    setNotifications((prev) => [newNotification, ...prev]); // Thêm notification mới vào đầu danh sách
  });

  const handleCloseToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isActiveLink = (path: string) => {
    return location.pathname.startsWith(path)
      ? "text-blue-500 border-b-2 border-blue-500"
      : "text-gray-600 hover:text-blue-500";
  };

  // ✅ Thêm hàm xử lý khi click notification
  const handleNotificationSelect = async (notification: AppNotification) => {
    try {
      // Đánh dấu đã đọc nếu chưa đọc
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);

        // Cập nhật state notifications
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      }

      // Điều hướng
      navigate(`/doctor/diagnose-diseases/${notification.id}`);
      setNotificationDropdownOpen(false);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Vẫn điều hướng dù có lỗi
      navigate(`/doctor/diagnose-diseases/${notification.id}`);
      setNotificationDropdownOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast hiển thị ở góc phải trên */}
      <div className="fixed top-4 right-4 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            autoClose={3000}
            onClose={() => handleCloseToast(toast.id)}
          />
        ))}
      </div>

      {/* Navigation header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-400 shadow-lg rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo và tên app */}
            <Link to="/" className="flex items-center space-x-3 group">
              <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
                Disease Prediction
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex space-x-8">
              <Link
                to="/home"
                className={`relative px-2 py-1 font-semibold transition ${isActiveLink(
                  "/home"
                )} hover:text-white hover:after:w-full after:transition-all after:duration-300 after:block after:h-0.5 after:bg-white after:w-0 after:mx-auto`}
              >
                Home
              </Link>
              {user?.roles?.some((role) => role.name === UserRole.DOCTOR) && (
                <>
                  <Link
                    to={APP_ROUTES.DOCTOR.DASHBOARD}
                    className={`relative px-2 py-1 font-semibold transition ${isActiveLink(
                      "/doctor/dashboard"
                    )} hover:text-white hover:after:w-full after:transition-all after:duration-300 after:block after:h-0.5 after:bg-white after:w-0 after:mx-auto`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={APP_ROUTES.DOCTOR.DIAGNOSE_DISEASES}
                    className={`relative px-2 py-1 font-semibold transition ${isActiveLink(
                      "/doctor/process"
                    )} hover:text-white hover:after:w-full after:transition-all after:duration-300 after:block after:h-0.5 after:bg-white after:w-0 after:mx-auto`}
                  >
                    Diagnose Diseases
                  </Link>
                </>
              )}
              {user?.roles?.some((role) => role.name === UserRole.ADMIN) && (
                <Link
                  to="/admin"
                  className={`relative px-2 py-1 font-semibold transition ${isActiveLink(
                    "/admin"
                  )} hover:text-white hover:after:w-full after:transition-all after:duration-300 after:block after:h-0.5 after:bg-white after:w-0 after:mx-auto`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* User info và notifications */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell và Dropdown */}
              {user && (
                <div
                  style={{ position: "relative" }}
                  ref={notificationDropdownRef}
                >
                  <NotificationBell
                    userId={user.id}
                    notifications={notifications}
                    onClick={() => {
                      setNotificationDropdownOpen((open) => !open);
                      setUserDropdownOpen(false);
                    }}
                  />
                  {/* Notification Dropdown */}
                  {notificationDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "120%",
                        zIndex: 100,
                      }}
                    >
                      <NotificationDropdown
                        userId={user.id}
                        notifications={notifications}
                        onSelect={handleNotificationSelect} // ✅ Sử dụng handler mới
                      />
                    </div>
                  )}
                </div>
              )}

              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => {
                      setUserDropdownOpen((open) => !open);
                      setNotificationDropdownOpen(false); // Đóng notification dropdown nếu đang mở
                    }}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <span className="text-white font-semibold drop-shadow">
                      {user.name || user.email}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white transition-transform ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {userDropdownOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 py-2
                        transition-all duration-200 ease-out
                        transform opacity-100 scale-100 translate-y-0
                        animate-dropdown
                      `}
                      style={{
                        animation: "fadeDown 0.2s ease",
                      }}
                    >
                      <Link
                        to="/profile/edit"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1 border border-white rounded-md text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 bg-white rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 rounded-t-xl shadow-inner">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Disease Prediction System. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
