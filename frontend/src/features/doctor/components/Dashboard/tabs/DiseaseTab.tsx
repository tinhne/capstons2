import React from "react";
import DiseaseByLocationChart from "../DiseaseByLocationChart";
import AnalysisCard from "./AnalysisCard";
import { LocationIcon } from "./Icons";

const DiseaseTab: React.FC = () => (
  <div>
    icon={<LocationIcon />}
    title="Phân bố bệnh theo địa điểm" extraButtons=
    {
      <select className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="all">Tất cả bệnh</option>
        <option value="covid">COVID-19</option>
        <option value="dengue">Sốt xuất huyết</option>
        <option value="flu">Cúm</option>
      </select>
    }
    <div className="border border-gray-100 rounded-xl p-6 bg-gray-50 shadow-inner h-[500px]">
      <DiseaseByLocationChart />
    </div>
    <AnalysisCard
      title="Phân tích"
      content="Các tỉnh thành phía Nam có tỷ lệ mắc bệnh cao hơn, đặc biệt là TP.HCM, Bình Dương và Đồng Nai. Điều này có thể do mật độ dân số cao và thời tiết nóng ẩm thuận lợi cho sự phát triển của các bệnh truyền nhiễm."
      bgColor="blue-50"
      textColor="blue-700"
    />
  </div>
);

export default DiseaseTab;
