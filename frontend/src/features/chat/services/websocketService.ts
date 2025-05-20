import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { ChatMessage } from "../types";

let stompClient: Client | null = null;

export const connectWebSocket = (
  onMessageReceived: (message: any) => void,
  conversationId: string
) => {
  const socket = new SockJS("/ws");
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => {
      console.log("STOMP: " + str);
    },
    reconnectDelay: 5000,
    onConnect: () => {
      if (stompClient) {
        stompClient.subscribe(
          `/topic/conversations/${conversationId}`,
          (message) => {
            const receivedMessage = JSON.parse(message.body);
            onMessageReceived(receivedMessage);
          }
        );
      }
    },
  });

  stompClient.activate();
  return stompClient;
};

export const sendMessage = (chatMessage: ChatMessage) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(chatMessage),
    });
    return true;
  }
  return false;
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
