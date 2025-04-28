import React, { useRef, useEffect } from "react";
import { ChatMessage } from "../../types";

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
  doctorAdded?: boolean; // thêm prop mới
  onLeaveConversation?: () => void; // Thêm prop mới cho bác sĩ thoát
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

  // Auto-scroll to bottom when new messages arrive
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

  return (
    <div className="flex flex-col h-[700px] bg-gray-50 rounded-lg shadow">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-blue-600 text-white rounded-t-lg flex items-center">
        <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center text-lg font-bold mr-3">
          {isBot ? "🤖" : isDoctor ? "U" : "D"}
        </div>
        <div>
          <h2 className="font-bold">
            {isBot ? "Bot" : isDoctor ? "User Chat" : "Doctor Chat"}
          </h2>
          <p className="text-sm text-blue-100">
            {isBot
              ? "AI Health Assistant"
              : isDoctor
              ? "You are chatting as a doctor"
              : doctorId
              ? "You are connected to a doctor"
              : "AI Assistant"}
          </p>
        </div>
      </div>
      {/* Hiển thị nút thoát nếu là bác sĩ */}
      {isDoctor && onLeaveConversation && (
        <button
          onClick={onLeaveConversation}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Thoát cuộc trò chuyện
        </button>
      )}
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet.</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id ? `${message.id}-${index}` : `msg-${index}`}
                className={`mb-4 max-w-[80%] ${
                  message.sender === "user"
                    ? "ml-auto bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                    : message.sender === "doctor"
                    ? "mr-auto bg-green-500 text-white rounded-tl-lg rounded-tr-lg rounded-br-lg"
                    : message.sender === "system"
                    ? "mx-auto bg-gray-300 text-gray-800 rounded-lg text-center"
                    : "mr-auto bg-gray-200 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                } p-3`}
              >
                <p>{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === "user" || message.sender === "doctor"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp || message.time)}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex">
          <>
            <input
              type="text"
              value={inputValue}
              onChange={onInputChange}
              onKeyPress={onKeyPress}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={onSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none disabled:bg-gray-300"
              disabled={loading || inputValue.trim() === ""}
            >
              Send
            </button>
          </>
        </div>
      </div>
    </div>
  );
};

export default ChatBotView;
