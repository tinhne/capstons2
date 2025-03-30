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
import { logout } from "../../../features/auth/redux/authSlice";

// Định nghĩa các trang có thể hiển thị (cùng type với DashboardPage)
type PageType = "dashboard" | "analytics" | "message" | "settings";

interface SidebarProps {
  onMenuSelect: (page: PageType) => void;
  currentPage: PageType;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuSelect, currentPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 h-full">
      <div className="flex-1 overflow-y-auto h-full">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-white font-bold text-lg">Menu</h1>
        </div>

        <MenuItem
          icon={<MdDashboard className="text-gray-300" size={20} />}
          label="Dashboard"
          isActive={currentPage === "dashboard"}
          onClick={() => onMenuSelect("dashboard")}
        />

        <MenuItem
          icon={<MdAnalytics className="text-gray-300" size={20} />}
          label="Analytics"
          isActive={currentPage === "analytics"}
          onClick={() => onMenuSelect("analytics")}
        />

        <MenuItem
          icon={<MdMessage className="text-gray-300" size={20} />}
          label="Messages"
          isActive={currentPage === "message"}
          onClick={() => onMenuSelect("message")}
          rightElement={
            <div className="bg-red-500 rounded-full px-2 py-0.5">
              <span className="text-white text-xs">5</span>
            </div>
          }
        />

        <MenuItem
          icon={<MdSettings className="text-gray-300" size={20} />}
          label="Settings"
          isActive={currentPage === "settings"}
          onClick={() => onMenuSelect("settings")}
        />

        {/* Phân cách menu với một đường kẻ trước khi thêm Logout */}
        <div className="border-t border-gray-700 my-4 mx-4"></div>

        {/* Menu item Logout */}
        <MenuItem
          icon={<MdLogout className="text-gray-300" size={20} />}
          label="Logout"
          isActive={false}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;
