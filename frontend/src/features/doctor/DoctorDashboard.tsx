import React, { useState } from "react";
import DiseaseCRUD from "./components/Dashboard/DiseaseCRUD";
import SymptomCRUD from "./components/Dashboard/SymptomCRUD";
import LogCharts from "./components/Dashboard/LogCharts";
import { Card } from "../../components/ui";

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "statistics" | "disease" | "symptom"
  >("statistics");

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bảng Điều Khiển Y Tế
          </h1>
          <p className="text-gray-500 mt-1">
            Phân tích và quản lý dữ liệu y tế
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "statistics"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("statistics")}
            >
              Thống Kê
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "disease"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("disease")}
            >
              Quản Lý Bệnh
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "symptom"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("symptom")}
            >
              Quản Lý Triệu Chứng
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="transition-all duration-300">
        {activeTab === "statistics" && (
          <div className="space-y-6 rounded-xl">
            <Card>
              <LogCharts />
            </Card>
          </div>
        )}

        {activeTab === "disease" && (
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Quản Lý Bệnh
            </h2>
            <DiseaseCRUD />
          </Card>
        )}

        {activeTab === "symptom" && (
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Quản Lý Triệu Chứng
            </h2>
            <SymptomCRUD />
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
