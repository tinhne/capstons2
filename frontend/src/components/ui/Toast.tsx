import React, { useEffect, useState, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaTimes,
} from "react-icons/fa";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface ToastProps {
  /**
   * ID duy nhất của toast
   */
  id?: string;

  /**
   * Nội dung thông báo
   */
  message: string;

  /**
   * Tiêu đề thông báo (tùy chọn)
   */
  title?: string;

  /**
   * Loại thông báo
   */
  type?: ToastType;

  /**
   * Vị trí hiển thị thông báo
   */
  position?: ToastPosition;

  /**
   * Thời gian tự động đóng (ms), 0 để không tự đóng
   */
  autoClose?: number;

  /**
   * Có hiển thị nút đóng hay không
   */
  showCloseButton?: boolean;

  /**
   * Hàm callback khi toast bị đóng
   */
  onClose?: () => void;

  /**
   * CSS classes bổ sung
   */
  className?: string;
}

/**
 * Toast Component - Hiển thị thông báo cho người dùng
 */
const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      message,
      title,
      type = "info",
      position = "top-right",
      autoClose = 5000,
      showCloseButton = true,
      onClose,
      className,
      ...props
    },
    ref
  ) => {
    const [isExiting, setIsExiting] = useState(false);
    const [remainingTime, setRemainingTime] = useState(autoClose);
    const [isPaused, setIsPaused] = useState(false);

    // Xử lý đóng toast
    const handleClose = () => {
      setIsExiting(true);
      // Đặt timeout để đợi animation trước khi gọi onClose
      setTimeout(() => {
        onClose?.();
      }, 300);
    };

    // Xử lý khi hover vào toast
    const handleMouseEnter = () => {
      setIsPaused(true);
    };

    // Xử lý khi hover ra khỏi toast
    const handleMouseLeave = () => {
      setIsPaused(false);
    };

    // Xử lý auto close
    useEffect(() => {
      // Nếu autoClose = 0, không tự động đóng
      if (autoClose === 0) return;

      let timeoutId: NodeJS.Timeout | null = null;

      if (!isPaused) {
        timeoutId = setTimeout(() => {
          handleClose();
        }, remainingTime);

        const startTime = Date.now();

        const interval = setInterval(() => {
          if (!isPaused) {
            const elapsedTime = Date.now() - startTime;
            const newRemainingTime = Math.max(0, remainingTime - elapsedTime);
            setRemainingTime(newRemainingTime);
          }
        }, 100);

        return () => {
          if (timeoutId) clearTimeout(timeoutId);
          clearInterval(interval);
        };
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [isPaused, remainingTime, autoClose]);

    // Lấy icon dựa theo loại toast
    const getIcon = () => {
      switch (type) {
        case "success":
          return <FaCheckCircle className="w-5 h-5 text-green-500" />;
        case "error":
          return <FaTimesCircle className="w-5 h-5 text-red-500" />;
        case "warning":
          return <FaExclamationCircle className="w-5 h-5 text-yellow-500" />;
        case "info":
        default:
          return <FaInfoCircle className="w-5 h-5 text-blue-500" />;
      }
    };

    // Xác định các class dựa trên type
    const typeClasses = {
      success: "bg-green-50 border-green-200",
      error: "bg-red-50 border-red-200",
      warning: "bg-yellow-50 border-yellow-200",
      info: "bg-blue-50 border-blue-200",
    };

    // Xác định các class dựa trên position
    const positionClasses = {
      "top-right": "top-0 right-0",
      "top-left": "top-0 left-0",
      "top-center": "top-0 left-1/2 transform -translate-x-1/2",
      "bottom-right": "bottom-0 right-0",
      "bottom-left": "bottom-0 left-0",
      "bottom-center": "bottom-0 left-1/2 transform -translate-x-1/2",
    };

    // Animation class
    const animationClass = isExiting ? "animate-fade-out" : "animate-fade-in";

    // Border color based on type
    const borderColorClass = {
      success: "border-l-4 border-l-green-500",
      error: "border-l-4 border-l-red-500",
      warning: "border-l-4 border-l-yellow-500",
      info: "border-l-4 border-l-blue-500",
    };

    // Kết hợp các class lại
    const toastClasses = twMerge(
      "w-full max-w-sm rounded-md shadow-md p-4 mb-3 border overflow-hidden flex",
      typeClasses[type],
      borderColorClass[type],
      animationClass,
      className
    );

    // Tính phần trăm thời gian còn lại
    const progressPercentage =
      autoClose > 0 ? (remainingTime / autoClose) * 100 : 0;

    const progressBarClasses = {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    };

    return (
      <div
        ref={ref}
        className={toastClasses}
        role="alert"
        aria-live="assertive"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="toast"
        {...props}
      >
        <div className="flex-shrink-0 mr-3 mt-0.5">{getIcon()}</div>
        <div className="flex-grow">
          {title && <h4 className="text-sm font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>

          {/* Progress bar */}
          {autoClose > 0 && (
            <div className="w-full h-1 mt-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressBarClasses[type]}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-3 -mt-1 -mr-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close notification"
          >
            <FaTimes />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";

export default Toast;
