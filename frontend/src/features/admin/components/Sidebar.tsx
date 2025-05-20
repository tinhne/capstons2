import React from "react";
import MenuItem from "./MenuItem";
import {
  MdDashboard,
  MdMessage,
  MdCalendarMonth,
  MdAnalytics,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../redux/store";

import { logout } from "../../../features/auth/redux/authSlice";

// Định nghĩa các trang có thể hiển thị (cùng type với DashboardPage)
type PageType = "dashboard" | "doctors" | "message" | "settings";

interface SidebarProps {
  onMenuSelect: (page: PageType) => void;
  currentPage: PageType;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuSelect, currentPage }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-700 h-full shadow-xl flex flex-col">
      {/* Logo and User Info */}
      <div className="flex flex-col items-center py-8 border-b border-blue-800">
        <img
          src="/vite.svg"
          alt="Logo"
          className="w-14 h-14 mb-2 rounded-full shadow-lg border-4 border-white"
        />
        <span className="text-white font-bold text-lg tracking-wide">
          Admin Panel
        </span>
        <span className="text-blue-200 text-xs mt-1">Welcome!</span>
      </div>
      <div className="flex-1 overflow-y-auto h-full mt-4">
        <MenuItem
          icon={<MdDashboard className="text-blue-200" size={22} />}
          label="Dashboard"
          isActive={currentPage === "dashboard"}
          onClick={() => onMenuSelect("dashboard")}
        />
        <MenuItem
          icon={<MdAnalytics className="text-blue-200" size={22} />}
          label="Doctors"
          isActive={currentPage === "doctors"}
          onClick={() => onMenuSelect("doctors")}
        />
        <MenuItem
          icon={<MdMessage className="text-blue-200" size={22} />}
          label="Messages"
          isActive={currentPage === "message"}
          onClick={() => onMenuSelect("message")}
          rightElement={
            <div className="bg-red-500 rounded-full px-2 py-0.5 shadow">
              <span className="text-white text-xs">5</span>
            </div>
          }
        />
        <MenuItem
          icon={<MdSettings className="text-blue-200" size={22} />}
          label="Settings"
          isActive={currentPage === "settings"}
          onClick={() => onMenuSelect("settings")}
        />
        <div className="border-t border-blue-800 my-6 mx-4"></div>
        <MenuItem
          icon={<MdLogout className="text-blue-200" size={22} />}
          label="Logout"
          isActive={false}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;
