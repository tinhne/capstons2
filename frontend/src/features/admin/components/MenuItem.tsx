import React, { useState, ReactNode } from "react";

interface SubItem {
  label: string;
}

interface MenuItemProps {
  icon?: ReactNode;
  label: string;
  isActive?: boolean;
  rightIcon?: string;
  rightElement?: React.ReactNode;
  subItems?: SubItem[];
  onClick?: () => void;
}

// const MenuItem: React.FC<MenuItemProps> = ({
//   icon,
//   label,
//   isActive = false,
//   rightIcon,
//   rightElement,
//   subItems = [],
// }) => {
//   const [expanded, setExpanded] = useState(false);

//   const toggleExpand = () => {
//     if (subItems.length > 0) {
//       setExpanded(!expanded);
//     }

//   };
const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  isActive = false,
  rightIcon,
  rightElement,
  subItems = [],
  onClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    if (subItems.length > 0) {
      setExpanded(!expanded);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      <div
        onClick={toggleExpand}
        className={`flex flex-row items-center justify-between px-4 py-2.5 cursor-pointer ${
          isActive ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
      >
        <div className="flex flex-row items-center">
          {icon &&
            (typeof icon === "string" ? (
              <img src={icon} alt="" className="w-5 h-5 mr-3" />
            ) : (
              <div className="text-gray-300 w-5 h-5 mr-3 flex items-center justify-center">
                {icon}
              </div>
            ))}
          <span
            className={`${
              isActive ? "text-white font-medium" : "text-gray-300"
            }`}
          >
            {label}
          </span>
        </div>

        <div className="flex flex-row items-center">
          {rightElement}
          {rightIcon &&
            (typeof rightIcon === "string" ? (
              <img src={rightIcon} alt="" className="w-4 h-4 ml-2" />
            ) : (
              <div className="text-gray-300 w-4 h-4 ml-2 flex items-center justify-center">
                {rightIcon}
              </div>
            ))}
        </div>
      </div>

      {expanded && subItems.length > 0 && (
        <div className="ml-8 mt-1">
          {subItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between py-2"
            >
              <span className="text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
