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
} from "recharts";

interface DiseaseBySeasonChartProps {
  height?: number;
  data?: Record<string, Record<string, number>>; // ✅ Nhận data từ props
}

interface SeasonDiseaseData {
  season: string;
  displayName: string; // ✅ Thêm display name
  diseases: { name: string; count: number; color: string }[];
}

const SEASON_COLORS = {
  "Đông-Xuân": "#10B981", // emerald-500 (Spring)
  "Xuân-Hè": "#F59E0B", // amber-500 (Summer)
  "Hè-Thu": "#EF4444", // red-500 (Fall)
  "Thu-Đông": "#3B82F6", // blue-500 (Winter)
};

const SEASON_DISPLAY_NAMES = {
  "Đông-Xuân": "🌸 Đông-Xuân",
  "Xuân-Hè": "☀️ Xuân-Hè",
  "Hè-Thu": "🍂 Hè-Thu",
  "Thu-Đông": "❄️ Thu-Đông",
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

const DiseaseBySeasonChart: React.FC<DiseaseBySeasonChartProps> = ({
  height = 400,
  data: propData, // ✅ Rename để tránh conflict
}) => {
  const [chartData, setChartData] = useState<SeasonDiseaseData[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("Đông-Xuân");

  // ✅ Process data từ props
  useEffect(() => {
    if (propData && Object.keys(propData).length > 0) {
      const formattedData: SeasonDiseaseData[] = Object.entries(propData).map(
        ([season, diseases]) => ({
          season,
          displayName:
            SEASON_DISPLAY_NAMES[season as keyof typeof SEASON_DISPLAY_NAMES] ||
            season,
          diseases: Object.entries(diseases)
            .map(([name, count], index) => ({
              name,
              count,
              color: DISEASE_COLORS[index % DISEASE_COLORS.length],
            }))
            .sort((a, b) => b.count - a.count),
        })
      );

      setChartData(formattedData);
      if (formattedData.length > 0) {
        setSelectedSeason(formattedData[0].season);
      }
    }
  }, [propData]);

  // ✅ Loading state nếu chưa có data
  if (!propData || Object.keys(propData).length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  const selectedSeasonData = chartData.find((d) => d.season === selectedSeason);

  return (
    <div className="w-full">
      {/* Season Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {chartData.map((seasonData) => (
          <button
            key={seasonData.season}
            onClick={() => setSelectedSeason(seasonData.season)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedSeason === seasonData.season
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {seasonData.displayName}
          </button>
        ))}
      </div>

      {/* Chart */}
      {selectedSeasonData && selectedSeasonData.diseases.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={selectedSeasonData.diseases}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`${value} ca`, "Số lượng"]}
              labelFormatter={(label: string) => `Bệnh: ${label}`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {selectedSeasonData.diseases.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Không có dữ liệu cho mùa{" "}
          {
            SEASON_DISPLAY_NAMES[
              selectedSeason as keyof typeof SEASON_DISPLAY_NAMES
            ]
          }
        </div>
      )}

      {/* Summary */}
      {selectedSeasonData && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Tổng số ca bệnh trong mùa{" "}
            <span
              className="font-semibold"
              style={{
                color:
                  SEASON_COLORS[selectedSeason as keyof typeof SEASON_COLORS],
              }}
            >
              {selectedSeasonData.displayName}
            </span>
            :{" "}
            <span className="font-bold">
              {selectedSeasonData.diseases.reduce((sum, d) => sum + d.count, 0)}{" "}
              ca
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DiseaseBySeasonChart;
