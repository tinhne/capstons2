import React from "react";
import { Notification } from "../types";

interface NotificationDropdownProps {
  userId: string;
  notifications: Notification[];
  onSelect: (notification: Notification) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onSelect,
}) => {
  // ✅ Sắp xếp thông báo từ mới nhất đến cũ nhất
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Ưu tiên sắp xếp theo createdAt, fallback sang timestamp nếu không có
    const dateA = new Date(a.createdAt || a.timestamp || 0);
    const dateB = new Date(b.createdAt || b.timestamp || 0);

    return dateB.getTime() - dateA.getTime(); // Mới nhất trước
  });

  return (
    <div className="bg-white rounded-xl shadow-2xl w-80 max-h-96 overflow-y-auto border border-blue-100">
      <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
        <span className="font-bold text-blue-700 text-lg">Thông báo</span>
        {notifications.length > 0 && (
          <span className="text-sm text-gray-500 ml-2">
            ({notifications.length})
          </span>
        )}
      </div>
      {sortedNotifications.length === 0 ? (
        <div className="p-4 text-gray-400 text-center">
          <svg
            className="w-12 h-12 mx-auto mb-2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Không có thông báo
        </div>
      ) : (
        sortedNotifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer transition hover:bg-blue-50 ${
              notification.isRead
                ? "bg-white text-gray-500"
                : "bg-blue-50 text-blue-900 font-semibold"
            } ${
              index === 0 && !notification.isRead
                ? "border-l-4 border-l-blue-500"
                : ""
            }`} // Highlight thông báo mới nhất
            onClick={() => onSelect(notification)}
          >
            <div className="pt-1">
              {notification.isRead ? (
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-blue-400 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <circle cx="10" cy="10" r="10" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="truncate font-medium">{notification.title}</div>
              {notification.content && (
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {notification.content}
                </div>
              )}
              {(notification.createdAt || notification.timestamp) && (
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatNotificationTime(
                    notification.createdAt || notification.timestamp
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ✅ Helper function để format thời gian hiển thị - support cả string và Date
const formatNotificationTime = (timestamp: string | Date): string => {
  const now = new Date();

  // ✅ Convert timestamp về Date object
  const time = timestamp instanceof Date ? timestamp : new Date(timestamp);

  // Kiểm tra nếu Date không hợp lệ
  if (isNaN(time.getTime())) {
    return "Không rõ";
  }

  const diffInMinutes = Math.floor(
    (now.getTime() - time.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) {
    return "Vừa xong";
  } else if (diffInMinutes < 60) {
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
    return time.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};
