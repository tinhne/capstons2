import React, { useState } from "react";
import { ChatMessage } from "../types";

interface DoctorConnectionProps {
  onSendMessage: (message: string) => void;
  query: string;
}

const DoctorConnection: React.FC<DoctorConnectionProps> = ({
  onSendMessage,
  query,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    // Simulate connecting to a doctor
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      onSendMessage(`Tôi muốn tư vấn về các triệu chứng: ${query}`);
    }, 2000);
  };

  if (connected) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg mt-4">
      <h3 className="text-xl text-white font-bold mb-2">
        Không tìm thấy triệu chứng phù hợp
      </h3>
      <p className="text-blue-100 mb-3">
        Chúng tôi không thể tìm thấy triệu chứng phù hợp trong cơ sở dữ liệu cho
        "{query}". Bạn có muốn kết nối với bác sĩ để được hỗ trợ chuyên sâu hơn
        không?
      </p>
      <div className="flex justify-center">
        <button
          onClick={handleConnect}
          disabled={connecting}
          className={`flex items-center px-6 py-3 bg-white text-blue-800 rounded-full font-bold shadow-md hover:bg-blue-50 transition duration-200 ${
            connecting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {connecting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang kết nối...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              Kết nối với bác sĩ
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DoctorConnection;
