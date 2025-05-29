import React, { useState } from "react";
import { DiagnosisLog } from "../../types";

interface LogDiagnosisFormProps {
  log: DiagnosisLog;
  onSubmit: (data: { diagnosis: string; note: string }) => void;
}

const LogDiagnosisForm: React.FC<LogDiagnosisFormProps> = ({
  log,
  onSubmit,
}) => {
  const [diagnosis, setDiagnosis] = useState(
    log.modelPrediction?.disease || ""
  );
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ diagnosis, note });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Chẩn đoán từ log</h2>
      <div className="mb-2">
        <span className="font-semibold">Bệnh nhân:</span> {log.patient.name} (
        {log.patient.age} tuổi, {log.patient.gender}, {log.patient.location})
      </div>
      <div className="mb-2">
        <span className="font-semibold">Thời gian bắt đầu triệu chứng:</span>{" "}
        {log.startedAt}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Triệu chứng:</span>
        <pre className="bg-gray-100 rounded p-2 text-sm">
          {JSON.stringify(log.symptoms, null, 2)}
        </pre>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Yếu tố nguy cơ:</span>
        <pre className="bg-gray-100 rounded p-2 text-sm">
          {JSON.stringify(log.risk_factors, null, 2)}
        </pre>
      </div>
      {log.modelPrediction && (
        <div className="mb-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
          <span className="font-semibold">Dự đoán hệ thống:</span>{" "}
          {log.modelPrediction.disease} (
          {Math.round(log.modelPrediction.probability * 100)}%)
          {log.modelPrediction.probability < 0.7 && (
            <div className="text-red-600 text-sm">
              * Xác suất thấp, cần xác nhận!
            </div>
          )}
        </div>
      )}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          Chẩn đoán của bác sĩ*
        </label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          required
          placeholder="Nhập tên bệnh hoặc mô tả chẩn đoán"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Ghi chú thêm</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú cho bệnh nhân hoặc hệ thống"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
      >
        Gửi chẩn đoán
      </button>
    </form>
  );
};

export default LogDiagnosisForm;
