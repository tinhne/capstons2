import React from "react";
import { ChatMessage } from "../../types";
import DiseaseResultView from "./DiseaseResultView";
import { Button } from "../../../../components/ui";
import { formatDate } from "../../../../utils/formatDate";

interface MessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
}) => {
  const isDoctor = message.sender === "doctor";
  const isBot = message.sender === "bot";
  const isSystem = message.sender === "system";

  if (message.type === "disease-result" && message.diseaseData) {
    return <DiseaseResultView message={message} />;
  }

  if (message.type === "connect-doctor") {
    return (
      <div className="w-full flex justify-center my-3">
        <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-200">
          <p className="text-center text-gray-700 mb-2">{message.content}</p>
          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              if (message.onClick) message.onClick();
            }}
          >
            Kết nối với bác sĩ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`p-3 rounded-lg max-w-[80%] ${
          isCurrentUser
            ? "bg-blue-500 text-white"
            : isDoctor
            ? "bg-green-100"
            : isBot
            ? "bg-blue-50"
            : isSystem
            ? "bg-gray-200 mx-auto text-center"
            : "bg-gray-100"
        }`}
      >
        {!isCurrentUser && !isSystem && (
          <div className="text-xs text-gray-500 mb-1">
            {isDoctor ? "Bác sĩ" : isBot ? "Health Bot" : "Người dùng"}
          </div>
        )}
        <p>{message.content}</p>
        {message.timestamp && (
          <div
            className={`text-xs mt-1 text-right ${
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatDate(message.timestamp, "time")}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
