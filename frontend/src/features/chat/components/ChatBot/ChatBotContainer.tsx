import React, { useState, useEffect } from "react";
import ChatBotView from "./ChatBotView";
import { ChatMessage } from "../../types";
import {
  chatWithBot,
  connectToChat,
  disconnectFromChat,
  getChatHistory,
  sendMessage,
  // saveBotMessage,
  // Xóa import sendTypingIndicator
} from "../../services/chatService";
import { useAuth } from "../../../../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";

export interface ChatBotContainerProps {
  userId: string;
  doctorId?: string;
  isDoctor?: boolean;
  isBot?: boolean;
  conversationId?: string;
}

const ChatBotContainer: React.FC<ChatBotContainerProps> = ({
  userId,
  doctorId,
  isDoctor = false,
  isBot = false, // Thêm giá trị mặc định
  conversationId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldConnectDoctor, setShouldConnectDoctor] = useState(false);
  // Xóa state liên quan đến typing indicator
  // const [isTyping, setIsTyping] = useState(false);
  // const [otherUserTyping, setOtherUserTyping] = useState(false);
  const { user } = useAuth();
  // Xóa typingTimeoutRef
  // const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load chat history when component mounts or conversationId changes
  useEffect(() => {
    const loadHistory = async () => {
      if (conversationId) {
        setLoading(true);
        try {
          const history = await getChatHistory(conversationId);
          setMessages(history || []);
        } catch (error) {
          console.error("Error loading chat history:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadHistory();
  }, [conversationId]);

  // Connect to WebSocket for real-time chat
  useEffect(() => {
    if (user && conversationId) {
      connectToChat(user.id, conversationId, handleReceiveMessage);
    }
  }, [user, conversationId]);

  const handleReceiveMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...(prevMessages || []), message]);
  };
  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || !conversationId) return;

    // Tạo message user
    const message: ChatMessage = {
      id: uuidv4(),
      sender: isDoctor ? "doctor" : "user",
      content: inputValue.trim(),
      conversationId: conversationId,
      senderId: userId,
      receiverId: isBot ? "bot" : doctorId || "",
      timestamp: new Date().toISOString(),
    };
    // Add message to local state
    setMessages((prevMessages) => [...prevMessages, message]);
    setInputValue("");

    // Gửi tin nhắn qua WebSocket hoặc API bot
    try {
      if (isBot) {
        // Xử lý đặc biệt cho bot
        setLoading(true);
        setTimeout(async () => {
          const botResponse = await chatWithBot(message);
          setMessages((prev) => [...prev, botResponse.data]);
          if (botResponse.needDoctor) {
            setShouldConnectDoctor(true);
          }
          setLoading(false);
        }, 1000);
      } else {
        // Gửi tin nhắn thông thường qua WebSocket
        await sendMessage(message);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Xóa phần quản lý typing indicator
    // if (e.target.value && !isTyping && conversationId) {
    //   setIsTyping(true);
    //   sendTypingIndicator(conversationId, userId, true);
    // }

    // // Reset typing timeout
    // if (typingTimeoutRef.current) {
    //   clearTimeout(typingTimeoutRef.current);
    // }

    // // Set timeout to stop typing indicator after 2 seconds of inactivity
    // typingTimeoutRef.current = setTimeout(() => {
    //   if (isTyping && conversationId) {
    //     setIsTyping(false);
    //     sendTypingIndicator(conversationId, userId, false);
    //   }
    // }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <ChatBotView
      messages={messages || []}
      inputValue={inputValue}
      loading={loading}
      onInputChange={handleInputChange}
      onSendMessage={handleSendMessage}
      onKeyPress={handleKeyPress}
      isDoctor={isDoctor}
      userId={userId}
      doctorId={doctorId}
      isBot={isBot}
      shouldConnectDoctor={shouldConnectDoctor}
      // Xóa prop otherUserTyping
      // otherUserTyping={otherUserTyping}
    />
  );
};

export default ChatBotContainer;
