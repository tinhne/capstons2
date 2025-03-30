export interface ChatMessage {
    id: number;
    sender: "user" | "bot";
    content: string;
  }
  