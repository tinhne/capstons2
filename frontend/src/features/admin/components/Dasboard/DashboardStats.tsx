import React, { useEffect, useState } from "react";
import Card from "../../../../components/ui/Card";
import userService from "../../../users/services/userService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const diseaseStats = [
  { name: "Cảm cúm", count: 120 },
  { name: "Sốt xuất huyết", count: 80 },
  { name: "Viêm họng", count: 60 },
  { name: "Covid-19", count: 40 },
];

const symptomStats = [
  { name: "Sốt", value: 100 },
  { name: "Ho", value: 80 },
  { name: "Đau họng", value: 60 },
  { name: "Mệt mỏi", value: 40 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardStats: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalDoctors, setTotalDoctors] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await userService.fetchAllUsers();
        setTotalUsers(users.length);
        const doctors = await userService.fetchAllDoctors();
        setTotalDoctors(doctors.length);
      } catch (err: any) {
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Đang tải thống kê...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">{totalUsers}</span>
          <span className="text-gray-600 mt-2">Tổng số người dùng</span>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-green-600">
            {totalDoctors}
          </span>
          <span className="text-gray-600 mt-2">Tổng số bác sĩ</span>
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Thống kê bệnh phổ biến</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={diseaseStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Thống kê triệu chứng</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={symptomStats}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {symptomStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DashboardStats;
