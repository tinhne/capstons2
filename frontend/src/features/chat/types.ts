export interface ChatMessage {
  id: number;
  sender: "user" | "bot" | "doctor";
  content: string;
  type?: "text" | "disease-search" | "disease-result" | "doctor-connection";
  diseaseData?: Disease[];
}

export interface Disease {
  diseaseId: string; // Changed from id
  originalId: string; // New field
  nameEn: string; // Changed from name
  nameVn: string; // New field
  descriptionEn: string; // Changed from description
  descriptionVn: string; // New field
  severity: string | null;
  specialization: string | null; // New field
  synonyms: string[];
  created_at: string; // New field
  updated_at: string; // New field
}

export interface SearchParams {
  symptomNames: string[];
}

export interface SearchResponse {
  diseases: Disease[];
  matchedSymptomCount: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  status: number;
  message: string;
}
