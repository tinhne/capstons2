export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
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
  participantIds: string[]; // thay thế userId/doctorId
  title: string;
  startTime?: string;
  lastMessageTime?: string;
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
