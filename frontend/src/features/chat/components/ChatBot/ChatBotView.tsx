import React, { useRef, useEffect } from "react";
import { ChatMessage } from "../../types";
import { FiSend } from "react-icons/fi";
import { BsRobot, BsPerson, BsPersonBadge } from "react-icons/bs";

interface ChatBotViewProps {
  messages: ChatMessage[];
  inputValue: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isDoctor?: boolean;
  userId: string;
  doctorId?: string;
  isBot: boolean;
  shouldConnectDoctor: boolean;
  doctorAdded?: boolean;
  onLeaveConversation?: () => void;
}

const ChatBotView: React.FC<ChatBotViewProps> = ({
  messages,
  inputValue,
  loading,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isDoctor = false,
  userId,
  doctorId,
  isBot,
  shouldConnectDoctor,
  doctorAdded,
  onLeaveConversation,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp?: string): string => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Avatar by sender type
  const getAvatar = (sender: string) => {
    if (sender === "bot")
      return <BsRobot className="text-blue-500" size={28} />;
    if (sender === "doctor")
      return <BsPersonBadge className="text-green-600" size={28} />;
    if (sender === "user")
      return <BsPerson className="text-gray-700" size={28} />;
    return <span className="text-gray-400">?</span>;
  };

  return (
    <div className="flex flex-col h-[800px] bg-white rounded-xl shadow-lg border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white flex items-center gap-3 border-b">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow text-2xl">
          {isBot ? (
            <BsRobot className="text-blue-500" />
          ) : isDoctor ? (
            <BsPersonBadge className="text-green-600" />
          ) : (
            <BsPerson className="text-gray-700" />
          )}
        </div>
        <div>
          <h2 className="font-bold text-lg">
            {isBot
              ? "AI Health Assistant"
              : isDoctor
              ? "Doctor Chat"
              : "User Chat"}
          </h2>
          <p className="text-xs text-blue-100">
            {isBot
              ? "Trợ lý sức khỏe AI"
              : isDoctor
              ? "Bạn đang trò chuyện với bệnh nhân"
              : doctorId
              ? "Bạn đang kết nối với bác sĩ"
              : "AI Assistant"}
          </p>
        </div>
        {isDoctor && onLeaveConversation && (
          <button
            onClick={onLeaveConversation}
            className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs shadow"
          >
            Thoát
          </button>
        )}
      </div>
      {/* Messages */}
      <div className="flex-1 px-4 py-3 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>Chưa có tin nhắn nào.</p>
            <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender !== "user" && (
                  <div className="mr-2 flex-shrink-0">
                    {getAvatar(message.sender || "unknown")}
                  </div>
                )}
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : message.sender === "doctor"
                      ? "bg-green-100 text-green-900 rounded-bl-none"
                      : message.sender === "system"
                      ? "bg-gray-200 text-gray-700 mx-auto text-center"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="whitespace-pre-line break-words">
                    {message.content}
                  </div>
                  <div className="text-xs text-right mt-1 opacity-70">
                    {formatTime(message.timestamp || message.time)}
                  </div>
                </div>
                {message.sender === "user" && (
                  <div className="ml-2 flex-shrink-0">
                    {getAvatar(message.sender)}
                  </div>
                )}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>
      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            disabled={loading}
            autoFocus
          />
          <button
            onClick={onSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow disabled:bg-gray-300"
            disabled={loading || inputValue.trim() === ""}
            aria-label="Gửi tin nhắn"
          >
            <FiSend size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotView;
