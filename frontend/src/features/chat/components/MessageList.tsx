import React from "react";
import { ChatMessage } from "../types";
import Message from "./Message";

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[calc(100vh-4rem-6rem-1.5rem-2rem)]"> 
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
