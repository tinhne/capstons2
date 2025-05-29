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

interface AgeGroupData {
  name: string;
  value: number;
}

const AgeGroupChart: React.FC<{ height?: number; width?: number }> = ({
  height = 300,
  width = 500,
}) => {
  const [data, setData] = useState<AgeGroupData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchDemographicData();
        console.log("Age group response:", response); // Debug log

        // Check if we have the expected data structure
        if (response && response.ageGroupData) {
          const formattedData = Object.entries(response.ageGroupData).map(
            ([name, value]) => ({
              name,
              value: Number(value),
            })
          );
          setData(formattedData);
        } else {
          console.error("Unexpected data structure:", response); // Debug log
          setError("No age group data available");
        }
      } catch (err) {
        console.error("Error fetching age group data:", err);
        setError("Failed to load age group data");
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
          {data.map((item) => (
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
