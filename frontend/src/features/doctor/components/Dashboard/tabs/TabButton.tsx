import React from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  children,
  count,
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-t-lg font-medium transition-all duration-200 flex items-center gap-2
      ${
        active
          ? "bg-white text-blue-600 border-t border-l border-r border-gray-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
  >
    {children}
    {count !== undefined && (
      <span
        className={`px-2 py-0.5 text-xs rounded-full ${
          active ? "bg-blue-100" : "bg-gray-200"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

export default TabButton;
