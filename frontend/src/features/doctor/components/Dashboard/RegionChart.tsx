import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { fetchDemographicData } from "../../services/logChartsService";

interface RegionData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const RegionChart: React.FC<{ height?: number; width?: number }> = ({
  height = 300,
  width = 500,
}) => {
  const [data, setData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchDemographicData();
        console.log("Region response:", response); // Debug log

        // Check if we have the expected data structure
        if (response && response.regionData) {
          const formattedData = Object.entries(response.regionData).map(
            ([name, value]) => ({
              name,
              value: Number(value),
            })
          );
          setData(formattedData);
        } else {
          console.error("Unexpected data structure:", response); // Debug log
          setError("No region data available");
        }
      } catch (err) {
        console.error("Error fetching region data:", err);
        setError("Failed to load region data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        Đang tải dữ liệu...
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (data.length === 0) return <div>Không có dữ liệu</div>;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Sort data by value for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Create a formatter function for percentages
  const formatPercent = (value: number) => {
    return ((value * 100) / total).toFixed(1);
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {name} ({(percent * 100).toFixed(1)}%)
      </text>
    );
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={140}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `${value.toLocaleString()} ca (${formatPercent(value)}%)`,
              "Số lượng",
            ]}
          />
          <Legend
            formatter={(value, entry, index) => (
              <span
                style={{
                  color: COLORS[index % COLORS.length],
                  fontWeight: 500,
                }}
              >
                {value}
              </span>
            )}
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Detailed legend table */}
      <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm">
        <div className="font-medium mb-2">Chi tiết theo vùng miền:</div>
        <div className="grid grid-cols-2 gap-3">
          {sortedData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
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

export default RegionChart;
