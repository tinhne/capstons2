import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface SeasonData {
  name: string;
  value: number;
}

interface SeasonChartProps {
  height?: number;
  width?: number;
  chartType?: "radar" | "area";
  data?: Record<string, number>; // ✅ Nhận data từ props
}

const SeasonChart: React.FC<SeasonChartProps> = ({
  height = 300,
  width = 500,
  chartType = "radar",
  data: propData, // ✅ Rename để tránh conflict
}) => {
  const [chartData, setChartData] = useState<SeasonData[]>([]);

  // ✅ Process data từ props
  useEffect(() => {
    if (propData && Object.keys(propData).length > 0) {
      // Order seasons chronologically
      const seasons = ["Xuân", "Hạ", "Thu", "Đông"];
      const formattedData = seasons
        .filter((season) => propData[season] !== undefined)
        .map((season) => ({
          name: season,
          value: Number(propData[season]),
        }));
      setChartData(formattedData);
    }
  }, [propData]);

  // ✅ Loading state nếu chưa có data
  if (!propData || Object.keys(propData).length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Không có dữ liệu mùa
      </div>
    );
  }

  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Create a formatter function for percentages
  const formatPercent = (value: number) => {
    return ((value * 100) / total).toFixed(1);
  };

  // Season colors
  const seasonColors = {
    Xuân: "#4CAF50", // Spring: Green
    Hạ: "#FF9800", // Summer: Orange
    Thu: "#795548", // Fall: Brown
    Đông: "#2196F3", // Winter: Blue
  };

  return (
    <div>
      {chartType === "radar" ? (
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
            <Radar
              name="Số ca bệnh"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()} ca (${formatPercent(value)}%)`,
                "Số ca bệnh",
              ]}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()} ca (${formatPercent(value)}%)`,
                "Số ca bệnh",
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              name="Số ca bệnh"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Detailed legend table */}
      <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm">
        <div className="font-medium mb-2">Chi tiết theo mùa:</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chartData.map((item) => {
            const seasonColor = (seasonColors as any)[item.name] || "#8884d8";
            return (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: seasonColor }}
                ></div>
                <div className="flex justify-between w-full">
                  <span>{item.name}:</span>
                  <span className="font-medium">
                    {item.value.toLocaleString()} ca (
                    {formatPercent(item.value)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-right font-medium">
          Tổng số: {total.toLocaleString()} ca
        </div>
      </div>

      {/* Season analysis */}
      <div className="mt-4 bg-indigo-50 p-3 rounded-lg text-sm">
        <h4 className="font-medium text-indigo-700 mb-2">Phân tích theo mùa</h4>
        <p className="text-indigo-700">
          {chartData.sort((a, b) => b.value - a.value)[0]?.name} có số ca bệnh
          cao nhất với{" "}
          {chartData
            .sort((a, b) => b.value - a.value)[0]
            ?.value.toLocaleString()}{" "}
          ca, chiếm{" "}
          {formatPercent(chartData.sort((a, b) => b.value - a.value)[0]?.value)}
          % tổng số ca. Phân bố ca bệnh theo mùa khá đồng đều, chênh lệch giữa
          mùa cao nhất và thấp nhất là{" "}
          {Math.abs(
            chartData.sort((a, b) => b.value - a.value)[0]?.value -
              chartData.sort((a, b) => a.value - b.value)[0]?.value
          ).toLocaleString()}{" "}
          ca.
        </p>
      </div>
    </div>
  );
};

export default SeasonChart;
