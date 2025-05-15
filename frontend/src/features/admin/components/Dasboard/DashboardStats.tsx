import React, { useEffect, useState } from "react";
import Card from "../../../../components/ui/Card";
import userService from "../../../users/services/userService";

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
      {/* Có thể thêm các Card thống kê khác ở đây */}
    </div>
  );
};

export default DashboardStats;
