import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types/user";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Function to check if a path is active
  const isActiveLink = (path: string) => {
    return location.pathname.startsWith(path)
      ? "text-blue-500 border-b-2 border-blue-500"
      : "text-gray-600 hover:text-blue-500";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo and app name */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">
                  Disease Prediction System
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="ml-6 flex space-x-8">
                <Link
                  to="/home"
                  className={`inline-flex items-center px-1 pt-1 ${isActiveLink(
                    "/home"
                  )}`}
                >
                  Home
                </Link>

                {user &&
                  user.roles?.some((role) => role.name === UserRole.DOCTOR) && (
                    <Link
                      to="/doctor/dashboard"
                      className={`inline-flex items-center px-1 pt-1 ${isActiveLink(
                        "/doctor"
                      )}`}
                    >
                      Doctor Dashboard
                    </Link>
                  )}

                {user &&
                  user.roles?.some((role) => role.name === UserRole.ADMIN) && (
                    <Link
                      to="/admin"
                      className={`inline-flex items-center px-1 pt-1 ${isActiveLink(
                        "/admin"
                      )}`}
                    >
                      Admin
                    </Link>
                  )}
              </nav>
            </div>

            {/* User information and logout */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
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
