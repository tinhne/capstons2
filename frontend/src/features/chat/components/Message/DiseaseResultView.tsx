import React from "react";
import { ChatMessage } from "../../types";

interface DiseaseResultViewProps {
  message: ChatMessage;
}

const DiseaseResultView: React.FC<DiseaseResultViewProps> = ({ message }) => {
  return (
    <div className="flex justify-start w-full mb-3">
      <div className="bg-blue-50 rounded-lg p-4 max-w-[85%] border-l-4 border-blue-500">
        <div className="text-xs text-gray-500 mb-1">Health Bot</div>
        <p className="mb-2">{message.content}</p>
        {message.diseaseData && message.diseaseData.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium mb-1 text-blue-700">
              Kết quả tìm thấy:
            </h4>
            <ul className="list-disc pl-5">
              {message.diseaseData.map((disease, index) => (
                <li key={index} className="mb-2">
                  <strong className="text-gray-800">{disease.name}</strong>
                  <p className="text-gray-700 text-sm mt-1">
                    {disease.description}
                  </p>
                  {disease.treatments && disease.treatments.length > 0 && (
                    <div className="mt-1 ml-2">
                      <span className="text-xs font-medium text-gray-600">
                        Phương pháp điều trị:
                      </span>
                      <ul className="list-disc pl-5 text-xs text-gray-600">
                        {disease.treatments.map((treatment, idx) => (
                          <li key={idx}>{treatment}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-2 border-t border-blue-200 text-xs text-gray-500">
              Lưu ý: Đây chỉ là thông tin tham khảo. Vui lòng tham khảo ý kiến
              bác sĩ để được chẩn đoán chính xác.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseResultView;
