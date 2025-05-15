import axios from "axios";
import apiClient from "../../../utils/apiClient";
import {
  SymptomSearch,
  DiseaseSearchResult,
  ChatMessage,
  Conversation,
} from "../types";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Interface for WebSocket connection configuration
interface WebSocketConfig {
  onMessageReceived: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

// Keep track of active WebSocket connections
let stompClient: Client | null = null;

const API_URL = "/api/health";

// API calls cho chẩn đoán bệnh
export const searchDisease = async (
  search: SymptomSearch
): Promise<DiseaseSearchResult> => {
  try {
    const response = await axios.post(`${API_URL}/search`, search);
    return response.data;
  } catch (error) {
    console.error("Error searching diseases:", error);
    return { diseases: [], matchedSymptomCount: 0 };
  }
};

export const getChatHistory = async (
  conversationId: string
): Promise<ChatMessage[]> => {
  const response = await apiClient.get(`/chat/${conversationId}/history`);
  return response.data;
};

export const getUserConversations = async (
  userId: string
): Promise<Conversation[]> => {
  const response = await apiClient.get(`/chat/conversations?userId=${userId}`);
  // console.log("Response Conversation", response);
  return response.data;
};

/**
 * Connect to the WebSocket server to receive real-time messages
 * @param userId ID of the current user
 * @param conversationId ID of the conversation to subscribe to
 * @param config WebSocket configuration
 */
export const connectWebSocket = (
  userId: string,
  conversationId: string,
  config: WebSocketConfig
): void => {
  // Disconnect existing connection if any
  disconnectWebSocket();

  // Get the base URL from API client or environment config
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  // Create a new WebSocket connection with proper error handling
  try {
    const socket = new SockJS(`${baseUrl}/ws`);
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg) => {
        if (process.env.NODE_ENV !== "production") {
          console.log(msg);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      // Subscribe to conversation topic
      stompClient?.subscribe(
        `/topic/conversations/${conversationId}`,
        (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            const receivedMessage = parsedMessage.data || parsedMessage;
            config.onMessageReceived(receivedMessage);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        }
      );

      // Add user ID to headers for server tracking
      stompClient?.publish({
        destination: "/app/chat.addUser",
        headers: {
          userId: userId,
        },
        body: JSON.stringify({ userId, type: "JOIN" }),
      });

      // Call onConnect callback if provided
      if (config.onConnect) {
        config.onConnect();
      }
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP protocol error:", frame);
      if (config.onDisconnect) {
        config.onDisconnect();
      }
    };

    stompClient.onDisconnect = () => {
      if (config.onDisconnect) {
        config.onDisconnect();
      }
    };

    stompClient.activate();
  } catch (error) {
    console.error("Failed to connect to WebSocket:", error);
    if (config.onDisconnect) {
      config.onDisconnect();
    }
  }
};

/**
 * Connect to chat for a specific conversation
 * @param conversationId ID of the conversation
 * @param onMessageReceived Callback when a new message is received
 */
export const connectToChat = (
  userId: string,
  conversationId: string,
  onMessageReceived: (message: ChatMessage) => void
): void => {
  connectWebSocket(userId, conversationId, {
    onMessageReceived,
    onConnect: () => console.log("WebSocket connected successfully"),
    onDisconnect: () => console.warn("WebSocket disconnected"),
  });
};

/**
 * Send a message via WebSocket
 * @param message The message to send
 */
export const sendMessage = (message: ChatMessage): void => {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(message),
  });
};

/**
 * Disconnect from WebSocket server
 */
export const disconnectWebSocket = (): void => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

/**
 * Disconnect from chat
 */
export const disconnectFromChat = (): void => {
  disconnectWebSocket();
};
export const createConversation = async (
  senderId: string,
  receiverId: string
): Promise<Conversation> => {
  try {
    const response = await apiClient.post("/chat/start", {
      senderId,
      receiverId,
    });
    console.log("create conversation", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};
export const chatWithBot = async (
  message: ChatMessage
): Promise<{ data: ChatMessage; needDoctor: boolean }> => {
  const response = await apiClient.post(
    "/chat/bot/message",
    message,
    undefined,
    false
  );
  // response.data.data sẽ là { message, needDoctor }
  console.log("hi", response.data);
  return response.data;
};
export const getConversationById = async (
  conversationId: string
): Promise<Conversation> => {
  try {
    const response = await apiClient.get(
      `/chat/conversation/${conversationId}`
    );
    // console.log("conversation", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching conversation by id:", error);
    throw error;
  }
};
export const addUserToConversation = async (
  conversationId: string,
  userId: string
): Promise<any> => {
  try {
    // Truyền userId trong body dưới dạng object
    const response = await apiClient.post(
      `/chat/conversation/${conversationId}/add-user`,
      { userId } // Đảm bảo truyền đúng format {userId: "..."}
    );
    return response.data;
  } catch (error) {
    console.error("Error adding user to conversation:", error);
    throw error;
  }
};
// Thêm hàm kiểm tra bác sĩ có trong cuộc trò chuyện không
export const checkDoctorInConversation = async (
  conversationId: string
): Promise<boolean> => {
  try {
    const response = await apiClient.get(
      `/chat/conversation/${conversationId}`
    );
    const conversation = response.data;

    // Kiểm tra có bác sĩ nào trong conversation không
    // Giả sử có một API endpoint trả về role của mỗi user
    const participants = conversation.participantIds || [];

    if (participants.length <= 2) {
      return false; // Chỉ có user và bot
    }

    // Kiểm tra từng participant xem có role là doctor không
    // Đây là giả định, bạn cần điều chỉnh theo API thực tế của bạn
    for (const participantId of participants) {
      if (participantId !== "bot" && participantId !== conversation.senderId) {
        // Đây có thể là bác sĩ, nhưng cần kiểm tra thêm
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking doctor in conversation:", error);
    return false;
  }
};

// Thêm hàm để xử lý khi bác sĩ rời đi (nếu cần)
export const removeUserFromConversation = async (
  conversationId: string,
  userId: string
): Promise<any> => {
  try {
    const response = await apiClient.post(
      `/chat/conversation/${conversationId}/remove-user`,
      { userId }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing user from conversation:", error);
    throw error;
  }
};
