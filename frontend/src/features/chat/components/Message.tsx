import React from "react";
import { ChatMessage } from "../types";

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === "user";
  const isBot = message.sender === "bot";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2 w-full`}
    >
      {/* Tin nhắn của bot */}
      {isBot && (
        <div className="flex flex-col bg-[#003D61] bg-opacity-50 text-white p-4 rounded-lg max-w-lg w-full shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-300 text-black flex items-center justify-center rounded-full">
              🤖
            </div>
            <span className="text-md font-semibold">Bot</span>
          </div>
          <p className="mt-2 text-lg">{message.content}</p>
          <div className="flex space-x-3 mt-3">
            <button className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded">
              📋 Copy
            </button>
            <button className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded">
              ▶️ Run
            </button>
          </div>
        </div>
      )}

      {/* Tin nhắn của user */}
      {isUser && (
        <div className="flex items-center">
          <div className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow-md max-w-xs">
            {message.content}
          </div>
          <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full ml-2">
            😊
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
