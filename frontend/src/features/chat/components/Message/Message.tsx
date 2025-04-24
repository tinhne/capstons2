import React, { useState } from "react";
import { ChatMessage, Disease } from "../../types";

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === "user";
  const isBot = message.sender === "bot";
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Function to handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => console.error("Could not copy text: ", err)
    );
  };

  // Render disease search results if available
  const renderDiseaseResults = () => {
    if (!message.diseaseData || message.diseaseData.length === 0) return null;

    return (
      <div className="mt-4 border-t border-blue-400 pt-2">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-blue-300">
            Possible conditions ({message.diseaseData.length})
          </h4>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-3 max-h-80 overflow-y-auto px-2 py-2 bg-[#002D4B] rounded">
            {message.diseaseData.map((disease: Disease) => (
              <div
                key={disease.diseaseId}
                className="border border-blue-600 rounded p-3 bg-[#00263D]"
              >
                <h4 className="font-bold text-blue-300">{disease.nameEn}</h4>
                <p className="mt-1 text-sm text-gray-200">
                  {disease.descriptionEn}
                </p>
                {disease.synonyms && disease.synonyms.length > 0 && (
                  <div className="mt-1 text-xs text-blue-200">
                    <span className="font-semibold">Also known as:</span>{" "}
                    {disease.synonyms.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2 w-full`}
    >
      {/* Bot message */}
      {isBot && (
        <div className="flex flex-col bg-[#003D61] bg-opacity-50 text-white p-4 rounded-lg max-w-5xl w-full shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-300 text-black flex items-center justify-center rounded-full">
              🤖
            </div>
            <span className="text-md font-semibold">Bot</span>
          </div>
          <p className="mt-2 text-lg">{message.content}</p>

          {/* Show disease results if present */}
          {message.type === "disease-result" && renderDiseaseResults()}

          <div className="flex space-x-3 mt-3">
            <button
              onClick={copyToClipboard}
              className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded flex items-center"
            >
              📋 {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* User message */}
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
