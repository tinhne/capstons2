import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardStats from "./Dasboard/DashboardStats";
import DateSelector from "./Dasboard/DateSelector";
import MessageContent from "./Chat/MessageContent";
import DoctorList from "./Doctors/DoctorList";

// Định nghĩa các trang có thể hiển thị
type PageType = "dashboard" | "doctors" | "message" | "settings";

const AnalyticsDashboard: React.FC = () => {
  // State để theo dõi trang hiện tại
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  // Hàm xử lý khi menu item được click
  const handleMenuSelect = (page: PageType) => {
    setCurrentPage(page);
  };

  // Render nội dung dựa trên trang hiện tại
  const renderContent = () => {
    switch (currentPage) {
      case "message":
        return <MessageContent />;
      case "dashboard":
        // Đây là nội dung mặc định của dashboard
        return (
          <>
            <DashboardStats />
            <DateSelector />
            {/* Các component khác của dashboard */}
          </>
        );
      case "doctors":
        return (
          <>
            <DoctorList />
          </>
        );
      case "settings":
        return <div className="p-4">Settings Content</div>;
      default:
        return <DateSelector />;
    }
  };

  return (
    <div className="flex flex-row h-screen w-full bg-white">
      {/* Sidebar */}
      <div className="w-1/5">
        <Sidebar onMenuSelect={handleMenuSelect} currentPage={currentPage} />
      </div>

      {/* Main Content */}
      <div className="w-4/5">
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <Header />
          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
