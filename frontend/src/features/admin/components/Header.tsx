import React from "react";

const Header: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
      {/* Search Bar */}
      <div className="flex flex-row items-center bg-gray-100 rounded-lg px-3 py-2 w-1/3">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5efd90f7d2f76f6882bdf7922adc03c83d79930?placeholderIfAbsent=true&apiKey=b5e74c69689d42a195103714d3bfe4c1"
          className="w-5 h-5 mr-2"
          alt="Search"
        />
        <input
          placeholder="Type to search..."
          className="flex-1 text-gray-600 bg-transparent outline-none"
        />
      </div>

      {/* User Profile */}
      <div className="flex flex-row items-center">
        <div className="mr-4 cursor-pointer">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ad4ba7acff9322b3f229a6b2634c47d7d915e72?placeholderIfAbsent=true&apiKey=b5e74c69689d42a195103714d3bfe4c1"
            className="w-7 h-7"
            alt="Notification"
          />
        </div>

        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/dfcbf00b557c75d3460a7fc66fac324a87e3b512?placeholderIfAbsent=true&apiKey=b5e74c69689d42a195103714d3bfe4c1"
          className="w-6 h-6 mr-4"
          alt="Settings"
        />

        <div className="flex flex-row items-center cursor-pointer">
          <div className="mr-2">
            <p className="font-medium text-gray-800">Thomas Anree</p>
            <p className="text-gray-500 text-xs">Ux Designer</p>
          </div>

          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3bd7aef4fabe95f798bf1ba4e797ad072d8fba3d?placeholderIfAbsent=true&apiKey=b5e74c69689d42a195103714d3bfe4c1"
            className="w-15 h-8"
            alt="Dropdown"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
