import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { ChatMessage } from "../types";
interface ChatbotProps {
  token: string;
}
const Chatbot: React.FC<ChatbotProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "bot", content: "Hello! How can I help you?" },
  ]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "user",
      content: message,
    };
    setMessages([...messages, newMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "bot", content: "I'm still learning! 😊" },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div className="h-16 bg-blue-900 flex items-center px-6 shadow-md">
        <Header />
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-1 w-full p-5">
        {/* Sidebar */}
        <Sidebar />

        {/* Chatbox */}
        <div className="flex flex-col w-full mx-auto">
          <MessageList messages={messages} />
          <div className="h-24">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
