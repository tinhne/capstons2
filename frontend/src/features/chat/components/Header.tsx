import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/img/logo.svg";
import { FaUserCircle } from "react-icons/fa"; // Icon cho avatar mặc định
import { useAuth } from "../../../hooks/useAuth"; // Import useAuth hook

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Get user from useAuth as well

  // State cho dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click bên ngoài để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogin() {
    navigate("/auth");
  }

  function handleLogout() {
    logout(); // Sử dụng logoutUser từ useAuth
    navigate("/auth");
  }

  function handleProfile() {
    navigate("/user/profile");
  }

  // Determine if the user is logged in using both profile and auth state
  const isLoggedIn = user && user.id;

  return (
    <header className="w-full h-full text-white flex items-center justify-between px-6 py-2 shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="SIDS Logo" className="h-12 w-12" />
        <span className="text-3xl font-semibold italic">SIDS</span>
      </div>

      {/* Conditional rendering based on authentication state */}
      <div className="flex space-x-4">
        {isLoggedIn ? (
          // User is logged in - show avatar and dropdown
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <FaUserCircle className="h-10 w-10 text-white" />
              )}
              <span className="font-medium">{user?.name || "User"}</span>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleProfile}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // User is not logged in - show login and signup buttons
          <>
            <button
              onClick={handleLogin}
              className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition"
            >
              Login
            </button>
            <button className="border border-white text-white px-4 py-2 rounded-full font-medium hover:bg-white hover:text-black transition">
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
