import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label cho input
   */
  label?: string;

  /**
   * ID của input (tự động tạo nếu không cung cấp)
   */
  id?: string;

  /**
   * Thông báo lỗi
   */
  error?: string;

  /**
   * Văn bản gợi ý
   */
  helperText?: string;

  /**
   * Icon bên trái
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon bên phải
   */
  rightIcon?: React.ReactNode;

  /**
   * CSS classes bổ sung cho container
   */
  containerClassName?: string;

  /**
   * CSS classes bổ sung cho label
   */
  labelClassName?: string;

  /**
   * CSS classes bổ sung cho input
   */
  inputClassName?: string;

  /**
   * CSS classes bổ sung cho thông báo lỗi
   */
  errorClassName?: string;

  /**
   * CSS classes bổ sung cho văn bản gợi ý
   */
  helperTextClassName?: string;

  /**
   * Kích thước input
   */
  inputSize?: "sm" | "md" | "lg";

  /**
   * Variant của input
   */
  variant?: "outline" | "filled" | "unstyled";

  /**
   * Xử lý sự kiện focus
   */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;

  /**
   * Xử lý sự kiện blur
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  /**
   * Input có chiều rộng 100% hay không
   */
  fullWidth?: boolean;
}

/**
 * Input component - Sử dụng xuyên suốt ứng dụng
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName = "",
      labelClassName = "",
      inputClassName = "",
      errorClassName = "",
      helperTextClassName = "",
      inputSize = "md",
      variant = "outline",
      fullWidth = false,
      className = "",
      onFocus,
      onBlur,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Tạo ID ngẫu nhiên nếu không được cung cấp
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Xác định classes cho input dựa trên size
    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2",
      lg: "px-4 py-3 text-lg",
    };

    // Xác định classes cho input dựa trên variant
    const variantClasses = {
      outline:
        "border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500",
      filled:
        "border border-transparent bg-gray-100 focus:bg-white focus:border-blue-500",
      unstyled: "border-none bg-transparent shadow-none",
    };

    // Classes chung cho tất cả input
    const baseClasses = "block rounded-md focus:outline-none focus:ring-2";

    // Classes khi có lỗi
    const errorStateClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300"
      : "";

    // Classes khi disabled
    const disabledClasses = disabled
      ? "cursor-not-allowed opacity-60 bg-gray-100"
      : "";

    // Classes cho width
    const widthClasses = fullWidth ? "w-full" : "";

    // Classes cho input có icon
    const iconClasses = {
      left: leftIcon ? "pl-10" : "",
      right: rightIcon ? "pr-10" : "",
    };

    // Ghép tất cả classes lại
    const inputClasses = twMerge(
      baseClasses,
      sizeClasses[inputSize],
      variantClasses[variant],
      errorStateClasses,
      disabledClasses,
      widthClasses,
      iconClasses.left,
      iconClasses.right,
      inputClassName,
      className
    );

    // Container classes
    const containerClasses = twMerge(
      "mb-4",
      fullWidth ? "w-full" : "",
      containerClassName
    );

    // Label classes
    const labelClasses = twMerge(
      "block mb-2 text-sm font-medium text-gray-700",
      error ? "text-red-700" : "",
      labelClassName
    );

    // Error message classes
    const errorClasses = twMerge("mt-1 text-sm text-red-600", errorClassName);

    // Helper text classes
    const helperTextClasses = twMerge(
      "mt-1 text-sm text-gray-500",
      helperTextClassName
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={inputClasses}
            onFocus={onFocus}
            onBlur={onBlur}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className={errorClasses}>{error}</p>}
        {helperText && !error && (
          <p className={helperTextClasses}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
