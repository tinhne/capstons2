import React from "react";
import { Conversation } from "../../types";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Hiển thị chữ cái đầu tiên của tên bác sĩ hoặc người dùng
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Tạo màu ngẫu nhiên cho avatar dựa trên ID
  const getAvatarColor = (id: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];

    // Sử dụng id để chọn màu nhất quán
    const colorIndex =
      Math.abs(
        id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % colors.length;

    return colors[colorIndex];
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 border-b cursor-pointer transition-colors ${
        isActive
          ? "bg-blue-100 border-l-4 border-blue-500"
          : "hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 ${getAvatarColor(
            conversation.id
          )}`}
        >
          {getInitials(conversation.doctorName || conversation.userName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium truncate">
              {conversation.doctorName || "Bác sĩ"}
            </h3>
            <span className="text-xs text-gray-500">
              {conversation.lastMessageAt
                ? formatDate(conversation.lastMessageAt)
                : formatDate(conversation.startedAt)}
            </span>
          </div>

          <p className="text-sm text-gray-500 truncate">
            Nhấn để xem cuộc trò chuyện
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
