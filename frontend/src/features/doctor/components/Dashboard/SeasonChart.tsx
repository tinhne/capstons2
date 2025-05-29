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
import { fetchDemographicData } from "../../services/logChartsService";

interface SeasonData {
  name: string;
  value: number;
}

const SeasonChart: React.FC<{
  height?: number;
  width?: number;
  chartType?: "radar" | "area";
}> = ({ height = 300, width = 500, chartType = "radar" }) => {
  const [data, setData] = useState<SeasonData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchDemographicData();
        console.log("Season response:", response); // Debug log

        // Check if we have the expected data structure
        if (response && response.seasonData) {
          // Order seasons chronologically
          const seasons = ["Xuân-Hè", "Hè-Thu", "Thu-Đông", "Đông-Xuân"];
          const formattedData = seasons
            .filter((season) => response.seasonData[season] !== undefined)
            .map((season) => ({
              name: season,
              value: Number(response.seasonData[season]),
            }));
          setData(formattedData);
        } else {
          console.error("Unexpected data structure:", response); // Debug log
          setError("No season data available");
        }
      } catch (err) {
        console.error("Error fetching season data:", err);
        setError("Failed to load season data");
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

  // Season colors
  const seasonColors = {
    "Xuân-Hè": "#4CAF50", // Spring-Summer: Green
    "Hè-Thu": "#FF9800", // Summer-Fall: Orange
    "Thu-Đông": "#795548", // Fall-Winter: Brown
    "Đông-Xuân": "#2196F3", // Winter-Spring: Blue
  };

  return (
    <div>
      {chartType === "radar" ? (
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
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
            data={data}
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
          {data.map((item) => {
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
          {data.sort((a, b) => b.value - a.value)[0]?.name} có số ca bệnh cao
          nhất với{" "}
          {data.sort((a, b) => b.value - a.value)[0]?.value.toLocaleString()}{" "}
          ca, chiếm{" "}
          {formatPercent(data.sort((a, b) => b.value - a.value)[0]?.value)}%
          tổng số ca. Phân bố ca bệnh theo mùa khá đồng đều, chênh lệch giữa mùa
          cao nhất và thấp nhất là{" "}
          {Math.abs(
            data.sort((a, b) => b.value - a.value)[0]?.value -
              data.sort((a, b) => a.value - b.value)[0]?.value
          ).toLocaleString()}{" "}
          ca.
        </p>
      </div>
    </div>
  );
};

export default SeasonChart;
