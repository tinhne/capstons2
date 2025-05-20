import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ChatMessage, Conversation } from "../types";

// Định nghĩa kiểu state
interface ChatContextState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

// Định nghĩa các hành động có thể xảy ra
type ChatAction =
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "SET_ACTIVE_CONVERSATION"; payload: string }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Tạo context với kiểu dữ liệu
const ChatContext = createContext<
  | {
      state: ChatContextState;
      dispatch: React.Dispatch<ChatAction>;
    }
  | undefined
>(undefined);

// Trạng thái ban đầu
const initialState: ChatContextState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  loading: false,
  error: null,
};

// Reducer function để xử lý các action
function chatReducer(
  state: ChatContextState,
  action: ChatAction
): ChatContextState {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload };
    case "SET_ACTIVE_CONVERSATION":
      return { ...state, activeConversationId: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Props cho ChatProvider
interface ChatProviderProps {
  children: ReactNode;
}

// Provider component
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook để sử dụng chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
