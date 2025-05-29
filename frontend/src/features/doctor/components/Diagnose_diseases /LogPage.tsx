import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { fetchDiagnosisLogs } from "../../services/diagnoseDisease";
import {
  FaUserMd,
  FaMapMarkerAlt,
  FaClock,
  FaHeartbeat,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

interface LogItem {
  id: number;
  gender: string;
  age: number;
  location: string;
  symptomStartTime: string;
  symptoms: string[] | null;
  riskFactors: string[] | null;
  predictedDisease: string | null;
  notificationId: string;
  notificationTitle: string;
  notificationContent: string;
  status: string;
  createAt: string;
}

const statusMap: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  diagnosed: {
    label: "Đã chẩn đoán",
    color: "text-green-600",
    icon: <FaCheckCircle className="inline mr-1" />,
  },
  pending: {
    label: "Chưa xử lý",
    color: "text-yellow-600",
    icon: <FaExclamationTriangle className="inline mr-1" />,
  },
  default: {
    label: "Không xác định",
    color: "text-gray-500",
    icon: <FaExclamationTriangle className="inline mr-1" />,
  },
};

const LogsPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchDiagnosisLogs(user.id)
      .then((data) => {
        // ✅ Sắp xếp logs theo createAt từ mới nhất đến cũ nhất
        const sortedLogs = [...data].sort((a, b) => {
          const dateA = new Date(a.createAt);
          const dateB = new Date(b.createAt);
          return dateB.getTime() - dateA.getTime(); // Mới nhất trước
        });
        setLogs(sortedLogs);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // ✅ Helper function để format thời gian tạo
  const formatCreateTime = (createAt: string): string => {
    const date = new Date(createAt);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} giờ trước`;
    } else if (diffInMinutes < 10080) {
      // 7 days
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🩺 Nhật ký chẩn đoán bệnh
      </h1>
      {loading ? (
        <div className="text-center text-lg text-gray-600">
          Đang tải dữ liệu...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center text-gray-500">
          Chưa có nhật ký chẩn đoán nào.
        </div>
      ) : (
        <div className="grid gap-6">
          {logs.map((log, index) => {
            const status =
              !log.status || log.status === ""
                ? statusMap.diagnosed
                : statusMap[log.status] || statusMap.default;
            return (
              <div
                key={log.id}
                className={`bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center gap-4 border border-gray-200 hover:shadow-lg transition ${
                  index === 0 ? "border-l-4 border-l-blue-500" : "" // Highlight case mới nhất
                }`}
              >
                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaUserMd className="text-blue-500" />
                    <span className="font-semibold">
                      {log.gender} - {log.age} tuổi
                    </span>
                    <FaMapMarkerAlt className="text-red-400 ml-4" />
                    <span>{log.location}</span>
                    {/* ✅ Hiển thị thời gian tạo */}
                    <span className="text-xs text-gray-500 ml-auto bg-gray-100 px-2 py-1 rounded">
                      {formatCreateTime(log.createAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaClock className="text-gray-500" />
                    <span>
                      Bắt đầu triệu chứng:{" "}
                      <span className="font-medium">
                        {log.symptomStartTime}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaHeartbeat className="text-pink-500" />
                    <span>
                      Triệu chứng:{" "}
                      <span className="font-medium">
                        {log.symptoms && log.symptoms.length > 0
                          ? log.symptoms.join(", ")
                          : "Chưa cập nhật"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">Yếu tố nguy cơ:</span>
                    <span>
                      {log.riskFactors && log.riskFactors.length > 0
                        ? log.riskFactors.join(", ")
                        : "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">Chẩn đoán:</span>
                    <span>
                      {log.predictedDisease || (
                        <span className="italic text-gray-400">Chưa có</span>
                      )}
                    </span>
                  </div>
                </div>
                {/* Status & Action */}
                <div className="flex flex-col items-end gap-3 min-w-[160px]">
                  <div
                    className={`font-semibold flex items-center ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </div>
                  {/* ✅ Badge "MỚI" cho case đầu tiên */}
                  {index === 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                      MỚI
                    </span>
                  )}
                  <Link
                    to={`/doctor/diagnose-diseases/${log.notificationId}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Xem/Chỉnh sửa chi tiết
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LogsPage;
