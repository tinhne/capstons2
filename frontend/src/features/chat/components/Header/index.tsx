import React from "react";

interface HeaderProps {
  conversationTitle?: string;
  isOnline?: boolean;
  avatar?: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  conversationTitle = "Health Chat",
  isOnline,
  avatar,
  onBackClick,
  showBackButton = false,
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="mr-3 text-white hover:text-blue-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {avatar && (
          <div className="relative mr-3">
            <img
              src={avatar}
              alt={conversationTitle}
              className="w-8 h-8 rounded-full"
            />
            {isOnline !== undefined && (
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            )}
          </div>
        )}

        <h1 className="text-white text-xl font-bold">{conversationTitle}</h1>

        {isOnline !== undefined && !avatar && (
          <span
            className={`ml-2 inline-block w-3 h-3 rounded-full ${
              isOnline ? "bg-green-400" : "bg-gray-400"
            }`}
          ></span>
        )}
      </div>

      <div>
        <button className="text-white hover:text-blue-200 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;
