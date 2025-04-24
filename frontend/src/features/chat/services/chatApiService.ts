import axios from "axios";
import { ChatMessage, Conversation, ApiResponse } from "../types";

const API_URL = "/api/chat";

export const startConversation = async (
  doctorId: string,
  userId: string
): Promise<Conversation> => {
  try {
    const response = await axios.post<ApiResponse<Conversation>>(
      `${API_URL}/start`,
      { doctorId, userId }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error starting conversation:", error);
    throw error;
  }
};

export const getChatHistory = async (
  conversationId: string
): Promise<ChatMessage[]> => {
  try {
    const response = await axios.get<ApiResponse<ChatMessage[]>>(
      `${API_URL}/${conversationId}/history`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const getUserConversations = async (
  userId: string
): Promise<Conversation[]> => {
  try {
    const response = await axios.get<ApiResponse<Conversation[]>>(
      `${API_URL}/conversations?userId=${userId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    throw error;
  }
};
