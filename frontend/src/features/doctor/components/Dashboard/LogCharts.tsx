import React, { useState } from "react";
import TabButton from "./tabs/TabButton";
import AllChartsTab from "./tabs/AllChartsTab";
import DiseaseTab from "./tabs/DiseaseTab";

import { ChartIcon } from "./tabs/Icons";

type TabType = "all" | "disease" | "symptoms" | "risk" | "demographics";

const LogCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return <AllChartsTab />;
      case "disease":
        return <DiseaseTab />;
      case "risk":
        return <AllChartsTab />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ChartIcon />
            Thống Kê Y Tế
          </h2>
          <p className="text-gray-600 mt-1">
            Phân tích dữ liệu từ hệ thống y tế theo thời gian thực
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tất cả thời gian</option>
            <option value="month">30 ngày qua</option>
            <option value="week">7 ngày qua</option>
            <option value="today">Hôm nay</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-0 border-b border-gray-200">
        <TabButton
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        >
          Tất cả biểu đồ
        </TabButton>
        {/* <TabButton
          active={activeTab === "disease"}
          onClick={() => setActiveTab("disease")}
        >
          Phân bố bệnh
        </TabButton>
        <TabButton
          active={activeTab === "symptoms"}
          onClick={() => setActiveTab("symptoms")}
        >
          Triệu chứng phổ biến
        </TabButton>
        <TabButton
          active={activeTab === "risk"}
          onClick={() => setActiveTab("risk")}
        >
          Yếu tố nguy cơ
        </TabButton>
        <TabButton
          active={activeTab === "demographics"}
          onClick={() => setActiveTab("demographics")}
        >
          Thống kê dân số
        </TabButton> */}
      </div>

      {/* Content area */}
      <div className="bg-white p-6 rounded-b-xl rounded-tr-xl shadow-sm">
        {renderTabContent()}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-500 italic flex justify-between">
          <span>Dữ liệu được cập nhật lần cuối: 27/05/2025</span>
          <span>Nguồn: Hệ thống cảnh báo dịch bệnh và chẩn đoán</span>
        </div>
      </div>
    </div>
  );
};

export default LogCharts;
