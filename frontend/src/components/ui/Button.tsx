import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "link"
  | "outline";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Nội dung của button
   */
  children: React.ReactNode;

  /**
   * Loại button
   */
  variant?: ButtonVariant;

  /**
   * Kích thước button
   */
  size?: ButtonSize;

  /**
   * Icon hiển thị trước nội dung
   */
  startIcon?: React.ReactNode;

  /**
   * Icon hiển thị sau nội dung
   */
  endIcon?: React.ReactNode;

  /**
   * Button có chiều rộng đầy đủ
   */
  fullWidth?: boolean;

  /**
   * Hiển thị trạng thái loading
   */
  isLoading?: boolean;

  /**
   * Văn bản hiển thị khi loading
   */
  loadingText?: string;

  /**
   * Component spinner cho trạng thái loading
   */
  spinner?: React.ReactNode;

  /**
   * CSS classes bổ sung
   */
  className?: string;

  /**
   * Có bo tròn hay không
   */
  rounded?: boolean;

  /**
   * Có hiệu ứng ripple khi click hay không
   */
  ripple?: boolean;
}

/**
 * Button component - Sử dụng xuyên suốt ứng dụng
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      startIcon,
      endIcon,
      fullWidth = false,
      isLoading = false,
      loadingText,
      spinner,
      className = "",
      rounded = false,
      ripple = true,
      type = "button",
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Định nghĩa các lớp style cho các biến thể
    const variantStyles: Record<ButtonVariant, string> = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      success:
        "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      warning:
        "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500",
      info: "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-500",
      light: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
      dark: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500",
      link: "bg-transparent hover:bg-gray-100 text-blue-600 hover:text-blue-700 focus:ring-blue-500",
      outline:
        "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    };

    // Định nghĩa các lớp style cho các kích thước
    const sizeStyles: Record<ButtonSize, string> = {
      xs: "py-1 px-2 text-xs",
      sm: "py-1.5 px-3 text-sm",
      md: "py-2 px-4 text-base",
      lg: "py-2.5 px-5 text-lg",
      xl: "py-3 px-6 text-xl",
    };

    // Định nghĩa các lớp style cơ bản
    const baseStyles =
      "font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors";

    // Định nghĩa các lớp style bổ sung
    const fullWidthStyles = fullWidth ? "w-full" : "";
    const roundedStyles = rounded ? "rounded-full" : "rounded-md";
    const disabledStyles =
      disabled || isLoading ? "opacity-60 cursor-not-allowed" : "";

    // Kết hợp tất cả các lớp style
    const buttonStyles = twMerge(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidthStyles,
      roundedStyles,
      disabledStyles,
      className
    );

    // Component hiển thị trong trạng thái loading
    const renderSpinner = () => {
      if (spinner) {
        return spinner;
      }

      return (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
      );
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonStyles}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center">
            {renderSpinner()}
            {loadingText || children}
          </span>
        ) : (
          <span className="inline-flex items-center">
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-2">{endIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
