import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface DiseaseByRegionChartProps {
  height?: number;
  data?: Record<string, Record<string, number>>;
}

interface RegionDiseaseData {
  region: string;
  diseases: { name: string; count: number; color: string }[];
  icon: string;
}

const REGION_COLORS = {
  "Miền Bắc": "#3B82F6",
  "Miền Trung": "#F59E0B",
  "Miền Nam": "#10B981",
  Khác: "#6B7280",
};

const REGION_ICONS = {
  "Miền Bắc": "🏔️",
  "Miền Trung": "🏖️",
  "Miền Nam": "🌾",
  Khác: "📍",
};

const DISEASE_COLORS = [
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5A2B",
  "#EC4899",
  "#6366F1",
  "#84CC16",
  "#F97316",
];

const DiseaseByRegionChart: React.FC<DiseaseByRegionChartProps> = ({
  height = 400,
  data: propData,
}) => {
  const [chartData, setChartData] = useState<RegionDiseaseData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("Miền Trung");

  useEffect(() => {
    if (
      propData &&
      typeof propData === "object" &&
      Object.keys(propData).length > 0
    ) {
      const formattedData: RegionDiseaseData[] = Object.entries(propData).map(
        ([region, diseases]) => ({
          region,
          icon: REGION_ICONS[region as keyof typeof REGION_ICONS] || "📍",
          diseases: Object.entries(diseases)
            .map(([name, count], index) => ({
              name,
              count: Number(count), // ép kiểu về số
              color: DISEASE_COLORS[index % DISEASE_COLORS.length],
            }))
            .sort((a, b) => b.count - a.count),
        })
      );
      setChartData(formattedData);
      if (formattedData.length > 0) setSelectedRegion(formattedData[0].region);
    } else {
      setChartData([]);
    }
  }, [propData]);

  if (!propData || Object.keys(propData).length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Không có dữ liệu vùng miền
      </div>
    );
  }

  const selectedRegionData = chartData.find((d) => d.region === selectedRegion);

  // Debug dữ liệu truyền vào BarChart
  console.log("selectedRegionData.diseases", selectedRegionData?.diseases);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {chartData.map((regionData) => (
          <button
            key={regionData.region}
            onClick={() => setSelectedRegion(regionData.region)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
              selectedRegion === regionData.region
                ? "bg-rose-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {regionData.icon} {regionData.region}
          </button>
        ))}
      </div>
      {selectedRegionData && selectedRegionData.diseases.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={selectedRegionData.diseases}
            margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
            // Bỏ layout hoặc để layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis type="number" tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [`${value} ca`, "Số lượng"]}
              labelFormatter={(label: string) => `Bệnh: ${label}`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {selectedRegionData.diseases.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Không có dữ liệu cho {selectedRegion}
        </div>
      )}
    </div>
  );
};

export default DiseaseByRegionChart;
