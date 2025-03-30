import React from "react";

const DateSelector: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex flex-row items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/5e3fb101241f366752c53c669e8f3fab55b19ff8?placeholderIfAbsent=true&apiKey=b5e74c69689d42a195103714d3bfe4c1"
          className="w-5 h-5 mr-2"
          alt="Calendar"
        />
        <span className="text-gray-700">Dec 29, 2023 - Jan 4, 2024</span>
      </div>

      <div className="flex flex-row items-center bg-gray-100 rounded-lg px-3 py-1.5 cursor-pointer">
        <span className="text-gray-700 mr-2">Daily</span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0b9a7c33a4b67d91c875a5b405e92637f5dfff89?placeholderIfAbsent=true&apiKey=b5e74c69689d42a195103714d3bfe4c1"
          className="w-4 h-4"
          alt="Dropdown"
        />
      </div>
    </div>
  );
};

export default DateSelector;
