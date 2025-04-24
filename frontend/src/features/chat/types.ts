export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  sender?: string; // "user" | "doctor" | "system"
  timestamp?: string;
  time?: string; // For backward compatibility
  isRead?: boolean;
}

export interface DiseaseData {
  id: string;
  name: string;
  description: string;
  treatments?: string[];
  symptoms?: string[];
  severity?: string;
}

export interface SymptomSearch {
  symptoms: string[];
  language?: string;
}

export interface DiseaseSearchResult {
  diseases: DiseaseData[];
  matchedSymptomCount: number;
}

export interface Conversation {
  conversationId: string;
  userId: string; // ID của người dùng
  doctorId: string; // ID của bác sĩ
  startTime?: string; // Thời gian bắt đầu cuộc trò chuyện
  lastMessageTime?: string; // Thời gian tin nhắn cuối
  senderId?: string; // ID của người gửi tin nhắn cuối
  receiverId?: string; // ID của người nhận tin nhắn cuối
  userName?: string; // Tên của người dùng
  doctorName?: string; // Tên của bác sĩ
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  preventions: string[];
  match?: number; // Phần trăm phù hợp
}

export interface SearchParams {
  symptomNames: string[];
}

export interface SearchResponse {
  diseases: Disease[];
  matchedSymptomCount: number;
}

export interface ApiResponse<T = any> {
  data: T;
}

// WebSocket message type
export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
}

export interface ErrorResponse {
  status: number;
  message: string;
}
