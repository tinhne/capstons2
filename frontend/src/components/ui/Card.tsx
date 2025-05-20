import React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Tiêu đề của card
   */
  cardTitle?: React.ReactNode;

  /**
   * Tiêu đề phụ của card
   */
  subtitle?: React.ReactNode;

  /**
   * Nội dung của card
   */
  children: React.ReactNode;

  /**
   * Nội dung footer của card
   */
  footer?: React.ReactNode;

  /**
   * Component hình ảnh phía trên của card
   */
  coverImage?: React.ReactNode;

  /**
   * CSS class cho container
   */
  className?: string;

  /**
   * CSS class cho phần header
   */
  headerClassName?: string;

  /**
   * CSS class cho phần body
   */
  bodyClassName?: string;

  /**
   * CSS class cho phần footer
   */
  footerClassName?: string;

  /**
   * Có hiển thị shadow hay không
   */
  withShadow?: boolean;

  /**
   * Cấp độ shadow (1-5)
   */
  shadowLevel?: 1 | 2 | 3 | 4 | 5;

  /**
   * Component hiển thị ở góc phải phần header
   */
  headerAction?: React.ReactNode;

  /**
   * Có padding ở phần body hay không
   */
  bodyNoPadding?: boolean;

  /**
   * Có border hay không
   */
  withBorder?: boolean;

  /**
   * Độ bo góc
   */
  rounded?: boolean | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

/**
 * Card Component - Dùng để hiển thị nội dung có cấu trúc
 */
const Card: React.FC<CardProps> = ({
  cardTitle,
  subtitle,
  children,
  footer,
  coverImage,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  withShadow = true,
  shadowLevel = 1,
  headerAction,
  bodyNoPadding = false,
  withBorder = true,
  rounded = "md",
  ...props
}) => {
  // Xác định className dựa trên shadow level
  const getShadowClass = () => {
    if (!withShadow) return "";

    const shadowClasses = {
      1: "shadow-sm",
      2: "shadow",
      3: "shadow-md",
      4: "shadow-lg",
      5: "shadow-xl",
    };

    return shadowClasses[shadowLevel];
  };

  // Xác định className dựa trên rounded
  const getRoundedClass = () => {
    if (typeof rounded === "boolean") {
      return rounded ? "rounded-md" : "";
    }
    return `rounded-${rounded}`;
  };

  // Xác định className dựa trên border
  const getBorderClass = () => {
    return withBorder ? "border border-gray-200" : "";
  };

  // Lớp CSS cho phần body
  const bodyClasses = twMerge(
    "card-body",
    !bodyNoPadding ? "p-4" : "",
    bodyClassName
  );

  // Lớp CSS cho card container
  const cardClasses = twMerge(
    "bg-white overflow-hidden",
    getRoundedClass(),
    getBorderClass(),
    getShadowClass(),
    className
  );

  // Lớp CSS cho header
  const headerClasses = twMerge(
    "card-header p-4 bg-white border-b border-gray-200 flex justify-between items-center",
    headerClassName
  );

  // Lớp CSS cho footer
  const footerClasses = twMerge(
    "card-footer p-4 bg-gray-50 border-t border-gray-200",
    footerClassName
  );

  return (
    <div className={cardClasses} {...props}>
      {coverImage && <div className="card-image">{coverImage}</div>}

      {(cardTitle || subtitle || headerAction) && (
        <div className={headerClasses}>
          <div>
            {cardTitle && (
              <h3 className="text-lg font-semibold text-gray-900">
                {cardTitle}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className={bodyClasses}>{children}</div>

      {footer && <div className={footerClasses}>{footer}</div>}
    </div>
  );
};

export default Card;
