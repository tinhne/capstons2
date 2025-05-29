import React, { useEffect, useRef } from "react";
import { Notification } from "../types";

interface NotificationBellProps {
  userId: string;
  notifications: Notification[];
  onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onClick,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const bellRef = useRef<HTMLButtonElement>(null);

  // Hiệu ứng rung khi có thông báo mới
  useEffect(() => {
    if (unreadCount > 0 && bellRef.current) {
      bellRef.current.classList.add("animate-shake");
      setTimeout(() => {
        bellRef.current?.classList.remove("animate-shake");
      }, 600);
    }
  }, [unreadCount]);

  return (
    <button
      ref={bellRef}
      onClick={onClick}
      className="relative p-2 rounded-full bg-gradient-to-tr from-blue-100 to-green-100 hover:from-blue-200 hover:to-green-200 shadow-md transition"
      aria-label="Thông báo"
      type="button"
    >
      <svg
        className="w-7 h-7 text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 border-2 border-white text-white rounded-full text-xs font-bold px-1.5 shadow-lg animate-pulse">
          {unreadCount}
        </span>
      )}
      {/* Hiệu ứng rung */}
      <style>
        {`
          .animate-shake {
            animation: shake 0.6s;
          }
          @keyframes shake {
            0% { transform: rotate(0deg);}
            20% { transform: rotate(-10deg);}
            40% { transform: rotate(10deg);}
            60% { transform: rotate(-10deg);}
            80% { transform: rotate(10deg);}
            100% { transform: rotate(0deg);}
          }
        `}
      </style>
    </button>
  );
};
