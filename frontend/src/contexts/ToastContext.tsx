import React, { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import Toast, { ToastProps, ToastPosition } from "../components/ui/Toast";

// Interface cho mỗi toast
interface ToastItem extends ToastProps {
  id: string;
}

// Props cho context
interface ToastContextProps {
  /**
   * Hiển thị một toast mới
   */
  showToast: (toast: Omit<ToastProps, "id">) => string;

  /**
   * Xóa một toast bởi ID
   */
  removeToast: (id: string) => void;

  /**
   * Xóa tất cả toast
   */
  clearToasts: () => void;

  /**
   * Cập nhật một toast hiện có
   */
  updateToast: (id: string, toast: Partial<ToastProps>) => void;
}

// Tạo context
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Props cho provider
interface ToastProviderProps {
  children: ReactNode;
  /**
   * Giới hạn số lượng toast hiển thị cùng lúc
   */
  limit?: number;
}

/**
 * Provider cho toast context
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  limit = 5,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Tạo ID duy nhất cho mỗi toast
  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Thêm một toast mới
  const showToast = (toast: Omit<ToastProps, "id">) => {
    const id = generateUniqueId();
    const newToast = { ...toast, id };

    // Nếu đạt giới hạn, xóa toast cũ nhất
    setToasts((prevToasts) => {
      let updatedToasts = [...prevToasts, newToast];
      if (limit && updatedToasts.length > limit) {
        updatedToasts = updatedToasts.slice(-limit);
      }
      return updatedToasts;
    });

    return id;
  };

  // Xóa một toast bởi ID
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Xóa tất cả toast
  const clearToasts = () => {
    setToasts([]);
  };

  // Cập nhật một toast hiện có
  const updateToast = (id: string, updatedProps: Partial<ToastProps>) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, ...updatedProps } : toast
      )
    );
  };

  // Nhóm toast theo vị trí
  const groupedToasts = toasts.reduce<Record<ToastPosition, ToastItem[]>>(
    (groups, toast) => {
      const position = toast.position || "top-right";
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(toast);
      return groups;
    },
    {
      "top-right": [],
      "top-left": [],
      "top-center": [],
      "bottom-right": [],
      "bottom-left": [],
      "bottom-center": [],
    }
  );

  // Tạo container styles dựa trên vị trí
  const getContainerStyles = (position: ToastPosition): string => {
    const baseStyles =
      "fixed z-50 p-4 w-full sm:max-w-sm flex flex-col pointer-events-none";

    switch (position) {
      case "top-right":
        return `${baseStyles} top-0 right-0 items-end`;
      case "top-left":
        return `${baseStyles} top-0 left-0 items-start`;
      case "top-center":
        return `${baseStyles} top-0 left-1/2 -translate-x-1/2 items-center`;
      case "bottom-right":
        return `${baseStyles} bottom-0 right-0 items-end`;
      case "bottom-left":
        return `${baseStyles} bottom-0 left-0 items-start`;
      case "bottom-center":
        return `${baseStyles} bottom-0 left-1/2 -translate-x-1/2 items-center`;
      default:
        return `${baseStyles} top-0 right-0 items-end`;
    }
  };

  return (
    <ToastContext.Provider
      value={{ showToast, removeToast, clearToasts, updateToast }}
    >
      {children}

      {/* Tạo portal cho mỗi vị trí toast */}
      {document.body &&
        Object.entries(groupedToasts).map(
          ([position, toastsInPosition]) =>
            toastsInPosition.length > 0 &&
            createPortal(
              <div
                className={getContainerStyles(position as ToastPosition)}
                key={position}
                data-testid={`toast-container-${position}`}
              >
                {toastsInPosition.map((toast) => (
                  <div key={toast.id} className="pointer-events-auto w-full">
                    <Toast {...toast} onClose={() => removeToast(toast.id)} />
                  </div>
                ))}
              </div>,
              document.body
            )
        )}
    </ToastContext.Provider>
  );
};

/**
 * Hook để sử dụng toast context
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
