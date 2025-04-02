import method from "../../../utils/apiClient";
import { SearchParams, SearchResponse, ApiResponse } from "../types";

/**
 * Sends symptoms to the API and returns disease predictions
 * @param params Object containing symptom names array
 */
export const searchDisease = async (
  params: SearchParams
): Promise<SearchResponse> => {
  try {
    // Make the API call with the proper structure
    const response = await method.post<ApiResponse<SearchResponse>>(
      "/api/search",
      params
    );

    // Check if the request was successful based on status code
    if (response.data.status === 1000) {
      return response.data.data;
    } else {
      // Handle unsuccessful responses with proper error
      throw new Error(response.data.message || "Error searching for diseases");
    }
  } catch (error: any) {
    // Handle network or unexpected errors
    if (error.response) {
      // The request was made and the server responded with an error status
      throw new Error(
        error.response.data.message || `Error: ${error.response.status}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response received from server");
    } else {
      // Something else caused the error
      throw error;
    }
  }
};

/**
 * Extracts symptoms from a user message
 * Simple implementation - can be enhanced with NLP
 */
export const extractSymptoms = (message: string): string[] => {
  // Convert to lowercase and remove punctuation
  const normalizedText = message.toLowerCase().replace(/[.,!?]/g, "");

  // Split by common separators
  const words = normalizedText.split(
    /\s+and\s+|\s*,\s*|\s+or\s+|\s+with\s+|\s+including\s+|\s+such\s+as\s+|\s+/
  );

  // Filter out very short words and common filler words
  return words
    .map((word) => word.trim())
    .filter(
      (word) =>
        word.length > 2 &&
        ![
          "the",
          "and",
          "have",
          "has",
          "with",
          "like",
          "feel",
          "feeling",
          "felt",
          "am",
          "is",
          "are",
          "was",
          "were",
        ].includes(word)
    );
};

/**
 * Determines if a message is asking about symptoms or health issues
 */
export const isHealthQuery = (message: string): boolean => {
  const healthTerms = [
    "symptom",
    "pain",
    "hurt",
    "ache",
    "sore",
    "fever",
    "cough",
    "sick",
    "disease",
    "condition",
    "diagnosis",
    "what is wrong",
    "problem",
    "suffering",
    "experiencing",
    "feeling",
    "headache",
    "nausea",
  ];

  const lowerMessage = message.toLowerCase();

  return healthTerms.some((term) => lowerMessage.includes(term));
};
