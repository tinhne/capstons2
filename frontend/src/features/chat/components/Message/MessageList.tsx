import React, { useRef, useEffect } from "react";
import { ChatMessage } from "../../types";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  onConnectDoctor?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onConnectDoctor,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Thêm onClick cho tin nhắn loại connect-doctor
  const processedMessages = messages.map((msg) => {
    if (msg.type === "connect-doctor") {
      return { ...msg, onClick: onConnectDoctor };
    }
    return msg;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col">
        {processedMessages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={
              (message.sender === "user" &&
                message.senderId === currentUserId) ||
              (message.sender === "doctor" &&
                message.senderId === currentUserId)
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
