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
import { fetchDemographicData } from "../../services/logChartsService";

interface DiseaseTypeData {
  name: string;
  value: number;
}

const DiseaseTypeChart: React.FC<{ height?: number; width?: number }> = ({
  height = 300,
  width = 500,
}) => {
  const [data, setData] = useState<DiseaseTypeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulating fetch since the data isn't available yet
    const fetchData = async () => {
      try {
        setLoading(true);
        // For now, we'll use placeholder data until the API provides disease type data
        // Sort data by value in descending order

        // When the API is ready, uncomment this:
        const response = await fetchDemographicData();
        if (response && response.diseaseData) {
          const formattedData = Object.entries(response.diseaseData)
            .map(([name, value]) => ({
              name,
              value: Number(value),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // chỉ lấy 50 bệnh phổ biến nhất
          setData(formattedData);
        } else {
          setError("No disease type data available");
        }
      } catch (err) {
        console.error("Error fetching disease type data:", err);
        setError("Failed to load disease type data");
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

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Create a formatter function for percentages
  const formatPercent = (value: number) => {
    return ((value * 100) / total).toFixed(1);
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip
            formatter={(value: number) => [
              `${value.toLocaleString()} ca (${formatPercent(value)}%)`,
              "Số lượng",
            ]}
          />
          <Legend
            formatter={() => (
              <span style={{ color: "#333", fontWeight: 500 }}>
                Số ca bệnh theo loại bệnh
              </span>
            )}
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ paddingTop: 10 }}
          />
          <Bar dataKey="value" name="Số ca bệnh" fill="#82ca9d">
            <LabelList
              dataKey="value"
              position="right"
              formatter={(value: number) =>
                `${value.toLocaleString()} (${formatPercent(value)}%)`
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Detailed legend table */}
      <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm">
        <div className="font-medium mb-2">Chi tiết theo loại bệnh:</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
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

export default DiseaseTypeChart;
