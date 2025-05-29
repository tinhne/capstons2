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
  return (
    <div className="bg-white rounded-xl shadow-2xl w-80 max-h-96 overflow-y-auto border border-blue-100">
      <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
        <span className="font-bold text-blue-700 text-lg">Thông báo</span>
      </div>
      {notifications.length === 0 ? (
        <div className="p-4 text-gray-400 text-center">Không có thông báo</div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer transition hover:bg-blue-50 ${
              notification.isRead
                ? "bg-white text-gray-500"
                : "bg-blue-50 text-blue-900 font-semibold"
            }`}
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
            <div>
              <div className="truncate">{notification.title}</div>
              {notification.createdAt && (
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString("vi-VN")}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
