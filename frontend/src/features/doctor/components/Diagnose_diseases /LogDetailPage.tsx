import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchLogByNotificationId,
  updateDiagnoseDisease,
} from "../../services/diagnoseDisease";
import {
  FaUserMd,
  FaMapMarkerAlt,
  FaClock,
  FaHeartbeat,
  FaNotesMedical,
} from "react-icons/fa";

interface LogData {
  id: number;
  gender: string;
  age: number;
  location: string;
  symptomStartTime: string;
  riskFactors: string[];
  symptoms: string[];
  diagnosis?: string;
}

const LogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{
    symptoms: string[];
    riskFactors: string[];
    diagnosis: string;
  }>({
    symptoms: [],
    riskFactors: [],
    diagnosis: "",
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchLogByNotificationId(id)
      .then((data) => {
        setLog(data);
        setForm({
          symptoms: data.symptoms || [],
          riskFactors: data.riskFactors || [],
          diagnosis: data.diagnosis || "",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: "symptoms" | "riskFactors", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    }));
  };

  const handleDiagnosisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, diagnosis: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!log?.id) {
      return;
    }
    try {
      await updateDiagnoseDisease({
        id: log.id,
        riskFactors: form.riskFactors,
        symptoms: form.symptoms,
        predicted_disease: form.diagnosis,
      });
      alert("Cập nhật chẩn đoán thành công!");
    } catch (err) {
      alert("Có lỗi khi cập nhật chẩn đoán!");
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!log) return <div className="p-4 text-red-600">Không tìm thấy log!</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <FaUserMd className="text-blue-500 text-2xl" />
          <span className="font-bold text-lg">
            {log.gender} - {log.age} tuổi
          </span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <FaMapMarkerAlt className="text-red-400" />
          <span className="text-gray-700">{log.location}</span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <FaClock className="text-gray-500" />
          <span className="text-gray-700">
            Bắt đầu triệu chứng:{" "}
            <span className="font-medium">{log.symptomStartTime}</span>
          </span>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white rounded-xl shadow p-6"
      >
        <div>
          <label className="block font-semibold mb-1 flex items-center gap-2">
            <FaHeartbeat className="text-pink-500" />
            Triệu chứng{" "}
            <span className="text-xs text-gray-400">
              (phân cách bằng dấu phẩy)
            </span>
          </label>
          <textarea
            className="w-full bg-gray-50 border rounded p-2 focus:outline-blue-400"
            rows={2}
            value={form.symptoms.join(", ")}
            onChange={(e) => handleChange("symptoms", e.target.value)}
            placeholder="Nhập các triệu chứng, ví dụ: Sốt, Ho, Đau đầu"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 flex items-center gap-2">
            <FaNotesMedical className="text-green-500" />
            Yếu tố nguy cơ{" "}
            <span className="text-xs text-gray-400">
              (phân cách bằng dấu phẩy)
            </span>
          </label>
          <textarea
            className="w-full bg-gray-50 border rounded p-2 focus:outline-blue-400"
            rows={2}
            value={form.riskFactors.join(", ")}
            onChange={(e) => handleChange("riskFactors", e.target.value)}
            placeholder="Nhập các yếu tố nguy cơ, ví dụ: Tiểu đường, Cao huyết áp"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 flex items-center gap-2">
            <FaNotesMedical className="text-blue-500" />
            Chẩn đoán bệnh
          </label>
          <input
            className="w-full bg-gray-50 border rounded p-2 focus:outline-blue-400"
            value={form.diagnosis}
            onChange={handleDiagnosisChange}
            placeholder="Nhập chẩn đoán bệnh"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold transition"
          >
            Lưu chẩn đoán
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogDetailPage;
