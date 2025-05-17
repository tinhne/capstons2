import React, { useRef, useEffect, useState } from "react";
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
  currentUserId: string; // Thêm prop này
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
  currentUserId,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  // State cho hiệu ứng typewriter
  const [displayedBotText, setDisplayedBotText] = useState<string>("");

  // Xác định tin nhắn bot cuối cùng
  const lastBotMessage = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "bot") return messages[i];
    }
    return null;
  }, [messages]);

  // Hiệu ứng typewriter cho tin nhắn bot cuối cùng
  useEffect(() => {
    if (!lastBotMessage || typeof lastBotMessage.content !== "string") {
      setDisplayedBotText("");
      return;
    }
    let i = 0;
    setDisplayedBotText(""); // reset trước khi chạy lại
    const text = lastBotMessage.content ?? "";
    let cancelled = false;
    function type() {
      if (cancelled) return;
      // Sửa lỗi mất chữ đầu và lỗi undefined
      setDisplayedBotText(text.slice(0, i + 1));
      i++;
      if (i < text.length) {
        setTimeout(type, 18);
      }
    }
    type();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line
  }, [lastBotMessage?.id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedBotText]);

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

  // Animation ba chấm
  const TypingDots = () => (
    <div className="flex items-center gap-1 h-7">
      <span
        className="dot bg-blue-400 animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></span>
      <span
        className="dot bg-blue-400 animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></span>
      <span
        className="dot bg-blue-400 animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></span>
      <style>
        {`
          .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 0 2px;
          }
          .animate-bounce {
            animation: bounce 1s infinite;
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(1); }
            40% { transform: scale(1.5); }
          }
        `}
      </style>
    </div>
  );

  return (
    <div className="flex flex-col h-[800px] bg-white rounded-xl shadow-lg border overflow-hidden ">
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
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>Chưa có tin nhắn nào.</p>
            <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message, idx) => {
              const isCurrentUser = message.senderId === currentUserId;
              const isLastBot =
                lastBotMessage && message.id === lastBotMessage.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="mr-2 flex-shrink-0">
                      {getAvatar(message.sender || "unknown")}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : message.sender === "doctor"
                        ? "bg-green-100 text-green-900 rounded-bl-none"
                        : message.sender === "system"
                        ? "bg-gray-200 text-gray-700 mx-auto text-center"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="whitespace-pre-line break-words">
                      {/* Nếu là tin nhắn bot cuối cùng thì dùng hiệu ứng typewriter */}
                      {isLastBot && !loading
                        ? displayedBotText
                        : message.content}
                    </div>
                    {/* Ẩn thời gian nhắn đi */}
                    {/* <div className="text-xs text-right mt-1 opacity-70">
                      {formatTime(message.timestamp || message.time)}
                    </div> */}
                  </div>
                  {isCurrentUser && (
                    <div className="ml-2 flex-shrink-0">
                      {getAvatar(message.sender || "unknown")}
                    </div>
                  )}
                </div>
              );
            })}
            {/* Hiển thị ba chấm khi loading và tin nhắn cuối là của user */}
            {loading &&
              messages.length > 0 &&
              messages[messages.length - 1].senderId === currentUserId && (
                <div className="flex justify-start items-center">
                  <div className="mr-2 flex-shrink-0">{getAvatar("bot")}</div>
                  <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 shadow-sm max-w-[70%]">
                    <TypingDots />
                  </div>
                </div>
              )}
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
