import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface AgeGroupData {
  name: string;
  value: number;
}

interface ChartProps {
  height?: number;
  width?: number;
  data?: Record<string, number>; // ✅ Nhận data từ props
}

const AgeGroupChart: React.FC<ChartProps> = ({
  height = 300,
  width = 500,
  data: propData, // ✅ Rename để tránh conflict
}) => {
  const [chartData, setChartData] = useState<AgeGroupData[]>([]);

  // ✅ Process data từ props
  useEffect(() => {
    if (propData && Object.keys(propData).length > 0) {
      const formattedData = Object.entries(propData).map(([name, value]) => ({
        name,
        value: Number(value),
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
        Không có dữ liệu nhóm tuổi
      </div>
    );
  }

  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Create a formatter function for percentages
  const formatPercent = (value: number) => {
    return ((value * 100) / total).toFixed(1);
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [
              `${value.toLocaleString()} ca (${formatPercent(value)}%)`,
              "Số lượng",
            ]}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#333", fontWeight: 500 }}>
                Số ca bệnh theo nhóm tuổi
              </span>
            )}
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ paddingTop: 10 }}
          />
          <Bar dataKey="value" name="Số ca bệnh" fill="#8884d8">
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value: number) => value.toLocaleString()}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Detailed legend table */}
      <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm">
        <div className="font-medium mb-2">Chi tiết theo nhóm tuổi:</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <div className="flex justify-between w-full">
                <span>{item.name}:</span>
                <span className="font-medium">
                  {item.value.toLocaleString()} ca ({formatPercent(item.value)}
                  %)
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-right font-medium">
          Tổng số: {total.toLocaleString()} ca
        </div>
      </div>
    </div>
  );
};

export default AgeGroupChart;
