import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { ChatMessage } from "../types";
import {
  searchDisease,
  extractSymptoms,
  isHealthQuery,
} from "../services/chatService";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "bot",
      content: "Hello! How can I help you with your health concerns?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Check if this is a health-related query
      if (isHealthQuery(message)) {
        // Extract symptoms from message
        const symptoms = extractSymptoms(message);

        if (symptoms.length > 0) {
          // Call the search API with extracted symptoms
          const searchResults = await searchDisease({ symptomNames: symptoms });

          // Create a response message with the results
          const botResponse: ChatMessage = {
            id: Date.now() + 1,
            sender: "bot",
            type: "disease-result",
            content:
              searchResults.matchedSymptomCount > 0
                ? `Based on your symptoms (${symptoms.join(", ")}), I found ${
                    searchResults.diseases.length
                  } possible conditions.`
                : "I couldn't identify specific conditions based on those symptoms. Please try different symptoms or be more specific.",
            diseaseData: searchResults.diseases,
          };

          setMessages((prev) => [...prev, botResponse]);
          setLoading(false);
          return;
        }
      }

      // Default response for non-health queries or when no symptoms are found
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            content:
              "If you'd like me to check your symptoms, please list them clearly (e.g., 'I have fever and cough').",
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          content:
            "Sorry, I encountered an error while processing your request. Please try again.",
        },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div className="h-16 bg-blue-900 flex items-center px-6 shadow-md">
        <Header />
      </div>

      {/* Main content */}
      <div className="flex flex-1 w-full p-5">
        {/* Sidebar */}
        <Sidebar />

        {/* Chatbox */}
        <div className="flex flex-col w-full mx-auto">
          <MessageList messages={messages} />
          <div className="h-24">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
          {loading && (
            <div className="text-center text-blue-300 text-sm">
              Analyzing your symptoms...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
