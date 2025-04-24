import axios from "axios";
import apiClient from "../../../utils/apiClient";
import {
  SymptomSearch,
  DiseaseSearchResult,
  ChatMessage,
  Conversation,
  ApiResponse,
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

// NLP functions
export const extractSymptoms = (message: string): string[] => {
  // Hàm đơn giản trích xuất từ khóa triệu chứng
  const commonSymptoms = [
    "sốt",
    "fever",
    "đau đầu",
    "headache",
    "ho",
    "cough",
    "đau",
    "pain",
    "đau ngực",
    "chest pain",
    "đau lưng",
    "back pain",
    "đau họng",
    "sore throat",
    "mệt mỏi",
    "fatigue",
    "buồn nôn",
    "nausea",
    "nôn",
    "vomiting",
    "tiêu chảy",
    "diarrhea",
    "khó thở",
    "shortness of breath",
    "chóng mặt",
    "dizziness",
    "đau bụng",
    "abdominal pain",
    "sưng",
    "swelling",
    "phát ban",
    "rash",
  ];

  const messageLower = message.toLowerCase();
  return commonSymptoms.filter((symptom) => messageLower.includes(symptom));
};

export const isHealthQuery = (message: string): boolean => {
  const healthKeywords = [
    "triệu chứng",
    "symptom",
    "bệnh",
    "sick",
    "đau",
    "pain",
    "bác sĩ",
    "doctor",
    "sức khỏe",
    "health",
    "bệnh tật",
    "disease",
    "tình trạng",
    "condition",
    "cảm thấy",
    "feel",
    "cảm giác",
    "feeling",
    "đau đầu",
    "headache",
    "ho",
    "cough",
    "cảm",
    "cold",
    "cúm",
    "flu",
    "covid",
    "bị",
    "have",
    "đang bị",
    "suffering",
  ];

  const messageLower = message.toLowerCase();
  return healthKeywords.some((keyword) => messageLower.includes(keyword));
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
  console.log("Response Conversation", response);
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
  const response = await apiClient.post("/chat/bot/message", message);
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
    console.log("conversation", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching conversation by id:", error);
    throw error;
  }
};
