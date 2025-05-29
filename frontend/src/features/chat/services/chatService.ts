import axios from "axios";
import apiClient from "../../../utils/apiClient";
import {
  SymptomSearch,
  DiseaseSearchResult,
  ChatMessage,
  Conversation,
  UserChatDetail,
  DiagnosisData,
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

// API calls for disease diagnosis
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
  receiverId: string,
  firstMessage: string
): Promise<Conversation> => {
  try {
    const response = await apiClient.post("/chat/start", {
      senderId,
      receiverId,
      firstMessage: firstMessage ?? "",
    });
    console.log("create conversation", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};
export const chatWithBot = async (
  idBot: String,
  userChatDetail: UserChatDetail
): Promise<{ data: ChatMessage; log: string; needDoctor: boolean }> => {
  const response = await apiClient.post(
    `/chat/bot/message?botId=${idBot}&conversationId=${userChatDetail.userMessage.conversationId}`,
    userChatDetail,
    undefined,
    false
  );
  // response.data.data will be { message, needDoctor }
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
    // Pass userId in body as object
    const response = await apiClient.post(
      `/chat/conversation/${conversationId}/add-user`,
      { userId } // Ensure correct format {userId: "..."}
    );
    return response.data;
  } catch (error) {
    console.error("Error adding user to conversation:", error);
    throw error;
  }
};
// Add function to check if doctor is in the conversation
export const checkDoctorInConversation = async (
  conversationId: string
): Promise<boolean> => {
  try {
    const response = await apiClient.get(
      `/chat/conversation/${conversationId}`
    );
    const conversation = response.data;

    // Check if there is any doctor in the conversation
    // Assume there is an API endpoint that returns the role of each user
    const participants = conversation.participantIds || [];

    if (participants.length <= 2) {
      return false; // Only user and bot
    }

    // Check each participant to see if there is a doctor
    // This is an assumption, adjust according to your actual API
    for (const participantId of participants) {
      if (participantId !== "bot" && participantId !== conversation.senderId) {
        // This could be a doctor, but further checking may be needed
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking doctor in conversation:", error);
    return false;
  }
};

// Add function to handle when doctor leaves (if needed)
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
export const deleteConversation = async (
  conversationId: string
): Promise<any> => {
  try {
    const response = await apiClient.delete(
      `/chat/conversation/${conversationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

export const updateConversation = async (
  conversationId: string,
  title: string
): Promise<Conversation> => {
  try {
    const response = await apiClient.put(
      `/chat/conversation/${conversationId}`,
      { title }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating conversation:", error);
    throw error;
  }
};
export const sendDiagnosisToDoctor = async (
  doctorId: string,
  diagnosisData: DiagnosisData
): Promise<any> => {
  try {
    // ✅ Format symptomStartTime để có đầy đủ datetime
    const formattedData = {
      ...diagnosisData,
      // Convert YYYY-MM-DD to YYYY-MM-DDTHH:MM:SS format
      symptomStartTime: diagnosisData.symptomStartTime.includes("T")
        ? diagnosisData.symptomStartTime
        : `${diagnosisData.symptomStartTime}T12:00:00`, // Add default time 12:00:00
    };

    console.log("Sending formatted diagnosis data:", formattedData);

    const response = await apiClient.post(
      `/diagnose?id_doctor=${doctorId}`,
      formattedData
    );
    return response.data;
  } catch (error) {
    console.error("Error sending diagnosis to doctor:", error);
    throw error;
  }
};
