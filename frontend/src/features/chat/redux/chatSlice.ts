import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { searchDisease } from "../services/chatService";
import { ChatMessage, Disease } from "../types";

// Define a more comprehensive message type that can handle disease data
interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [
    {
      id: 1,
      sender: "bot",
      content:
        "Hello! I'm your health assistant. Tell me about your symptoms and I'll try to help.",
    },
  ],
  loading: false,
  error: null,
};

// Create async thunk for symptom search
export const searchDiseases = createAsyncThunk(
  "chat/searchDiseases",
  async (symptoms: string[], { rejectWithValue }) => {
    try {
      const response = await searchDisease({ symptomNames: symptoms });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search for diseases");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },

    clearChat: (state) => {
      state.messages = [state.messages[0]]; // Keep only the welcome message
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(searchDiseases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful search
      .addCase(searchDiseases.fulfilled, (state, action) => {
        state.loading = false;

        // Extract data from the response
        const { diseases, matchedSymptomCount } = action.payload;

        // Create a new bot message with disease results
        const resultMessage: ChatMessage = {
          id: Date.now(),
          sender: "bot",
          type: "disease-result",
          content:
            matchedSymptomCount > 0
              ? `I found ${diseases.length} possible conditions that match ${matchedSymptomCount} of your symptoms.`
              : "I couldn't find any matching diseases for those symptoms. Please try different symptoms or be more specific.",
          diseaseData: diseases as Disease[],
        };

        state.messages.push(resultMessage);
      })
      // Handle errors
      .addCase(searchDiseases.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "An error occurred during search";

        // Add error message to chat
        state.messages.push({
          id: Date.now(),
          sender: "bot",
          content:
            "Sorry, I encountered an error while searching for diseases. Please try again.",
        });
      });
  },
});

export const { addMessage, clearChat, setLoading } = chatSlice.actions;
export default chatSlice.reducer;
