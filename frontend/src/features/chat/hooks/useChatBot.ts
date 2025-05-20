// import { useState, useEffect, useCallback } from "react";
// import { ChatMessage, Conversation } from "../types";
// import {
//   createConversation,
//   getChatHistory,
//   getUserConversations,
// } from "../services/chatService";
// import { searchDisease } from "../services/chatService";
// import {
//   connectWebSocket,
//   sendMessage as sendWebSocketMessage,
//   disconnectWebSocket,
// } from "../services/websocketService";

// interface UseChatBotProps {
//   userId?: string;
//   doctorId?: string;
//   isDoctor?: boolean;
// }

// export const useChatBot = ({
//   userId,
//   doctorId,
//   isDoctor = false,
// }: UseChatBotProps) => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [conversation, setConversation] = useState<Conversation | null>(null);
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversationId, setActiveConversationId] = useState<
//     string | null
//   >(null);
//   const [showConnectDoctorButton, setShowConnectDoctorButton] = useState(false);
//   const [connectingToDoctor, setConnectingToDoctor] = useState(false);

//   // Initialize conversation and load history
//   useEffect(() => {
//     const initializeChat = async () => {
//       if (userId) {
//         try {
//           // Get user's conversation list
//           setLoading(true);
//           const userConversations = await getUserConversations(userId);
//           setConversations(userConversations);

//           // If chatting with a specific doctor
//           if (doctorId && !activeConversationId) {
//             // Check if there is a conversation with this doctor
//             const existingConversation = userConversations.find(
//               (conv) => conv.doctorId === doctorId
//             );

//             if (existingConversation) {
//               setActiveConversationId(existingConversation.id);
//               await loadChatHistory(existingConversation.id);
//             } else if (doctorId) {
//               // Create a new conversation if not exists
//               const newConversation = await startConversation(doctorId, userId);
//               setConversation(newConversation);
//               setActiveConversationId(newConversation.id);

//               // Add welcome message
//               setMessages([
//                 {
//                   id: Date.now(),
//                   sender: "bot",
//                   content: "Welcome to the new conversation!",
//                   conversationId: newConversation.id,
//                 },
//               ]);
//             }
//           } else if (userConversations.length > 0 && !activeConversationId) {
//             // Default to open the first conversation
//             setActiveConversationId(userConversations[0].id);
//             await loadChatHistory(userConversations[0].id);
//           } else if (!doctorId && !activeConversationId) {
//             // If there is no conversation and no doctorId, show chat with bot
//             setMessages([
//               {
//                 id: Date.now(),
//                 sender: "bot",
//                 content:
//                   "Hello! I am your health assistant. You can describe your symptoms and I will help you learn about your condition.",
//                 timestamp: new Date().toISOString(),
//               },
//             ]);
//           }
//           setLoading(false);
//         } catch (error) {
//           console.error("Error initializing chat:", error);
//           setLoading(false);
//         }
//       } else {
//         // If no userId, show default message
//         setMessages([
//           {
//             id: 1,
//             sender: "bot",
//             content: "Please log in to start chatting with a doctor.",
//             timestamp: new Date().toISOString(),
//           },
//         ]);
//       }
//     };

//     initializeChat();

//     return () => {
//       disconnectWebSocket();
//     };
//   }, [userId, doctorId]);

//   // Connect WebSocket when activeConversationId is available
//   useEffect(() => {
//     if (activeConversationId && userId) {
//       connectWebSocket(handleWebSocketMessage, activeConversationId);

//       return () => {
//         disconnectWebSocket();
//       };
//     }
//   }, [activeConversationId, userId]);

//   // Handle message received from WebSocket
//   const handleWebSocketMessage = (messageData: any) => {
//     if (messageData && messageData.data) {
//       const newMessage = messageData.data;
//       // Only add message if it belongs to the current conversation
//       if (newMessage.conversationId === activeConversationId) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     }
//   };

//   // Load chat history
//   const loadChatHistory = async (conversationId: string) => {
//     try {
//       setLoading(true);
//       const history = await getChatHistory(conversationId);
//       setMessages(history);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error loading chat history:", error);
//       setLoading(false);
//     }
//   };

//   // Switch conversation
//   const handleChangeConversation = useCallback((conversationId: string) => {
//     setActiveConversationId(conversationId);
//     loadChatHistory(conversationId);
//   }, []);

//   // Connect with doctor
//   const handleConnectDoctor = useCallback(async () => {
//     if (!userId) return;

//     try {
//       setConnectingToDoctor(true);
//       setShowConnectDoctorButton(false);

//       // Add connecting message
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           sender: "system",
//           content: "Connecting to an online doctor...",
//           timestamp: new Date().toISOString(),
//         },
//       ]);

//       // Call API to connect to an online doctor
//       // TODO: Replace with actual API
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // Assume there is an online doctor
//       const randomDoctorId = `doc-${Math.floor(Math.random() * 1000)}`;

//       // Create a new conversation with the doctor
//       const newConversation = await startConversation(randomDoctorId, userId);

//       // Update conversation list
//       setConversations((prev) => [...prev, newConversation]);

//       // Switch to the new conversation
//       setActiveConversationId(newConversation.id);

//       // Add welcome message
//       setMessages([
//         {
//           id: Date.now(),
//           sender: "doctor",
//           content: "Hello! I am an online doctor. How can I help you?",
//           conversationId: newConversation.id,
//           senderId: randomDoctorId,
//           timestamp: new Date().toISOString(),
//         },
//       ]);

//       setConnectingToDoctor(false);
//     } catch (error) {
//       console.error("Error connecting to doctor:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           sender: "system",
//           content: "Unable to connect to a doctor. Please try again later.",
//           timestamp: new Date().toISOString(),
//         },
//       ]);
//       setConnectingToDoctor(false);
//     }
//   }, [userId]);

//   // Send message
//   const handleSendMessage = useCallback(
//     async (messageText: string) => {
//       if (!messageText.trim()) return;

//       if (!userId) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now(),
//             sender: "system",
//             content: "Please log in to send messages.",
//             timestamp: new Date().toISOString(),
//           },
//         ]);
//         return;
//       }

//       const senderRole = isDoctor ? "doctor" : "user";

//       // For conversation with doctor
//       if (activeConversationId) {
//         const currentConversation = conversations.find(
//           (conv) => conv.id === activeConversationId
//         );

//         if (!currentConversation) return;

//         const receiverId = isDoctor
//           ? currentConversation.userId
//           : currentConversation.doctorId;

//         // Create message object
//         const chatMessage: ChatMessage = {
//           id: Date.now(),
//           sender: senderRole,
//           content: messageText,
//           conversationId: activeConversationId,
//           senderId: userId,
//           receiverId: receiverId || "",
//           timestamp: new Date().toISOString(),
//         };

//         // Optimistic update
//         setMessages((prev) => [...prev, chatMessage]);

//         // Send message via WebSocket
//         sendWebSocketMessage(chatMessage);

//         return;
//       }

//       // Handle chat with health bot
//       const userMessage: ChatMessage = {
//         id: Date.now(),
//         sender: "user",
//         content: messageText,
//         senderId: userId,
//         timestamp: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, userMessage]);

//       if (isHealthQuery(messageText)) {
//         setLoading(true);
//         try {
//           const symptoms = extractSymptoms(messageText);

//           if (symptoms.length > 0) {
//             const searchResults = await searchDisease({
//               symptomNames: symptoms,
//             });

//             const botResponse: ChatMessage = {
//               id: Date.now() + 1,
//               sender: "bot",
//               type: "disease-result",
//               content:
//                 searchResults.matchedSymptomCount > 0
//                   ? `Based on your symptoms (${symptoms.join(", ")}), I found ${
//                       searchResults.diseases.length
//                     } possible conditions.`
//                   : "I could not identify any specific conditions based on those symptoms. Please try other symptoms or describe in more detail.",
//               diseaseData: searchResults.diseases,
//               timestamp: new Date().toISOString(),
//             };

//             setMessages((prev) => [...prev, botResponse]);

//             // Show connect to doctor button if there are results
//             if (searchResults.matchedSymptomCount > 0) {
//               setTimeout(() => {
//                 setShowConnectDoctorButton(true);
//               }, 1000);
//             }
//           } else {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 id: Date.now() + 1,
//                 sender: "bot",
//                 content:
//                   "I did not recognize any symptoms in your message. Please describe your symptoms more clearly (e.g., fever, cough, headache...).",
//                 timestamp: new Date().toISOString(),
//               },
//             ]);
//           }
//         } catch (error) {
//           console.error("Error processing message:", error);
//           setMessages((prev) => [
//             ...prev,
//             {
//               id: Date.now() + 1,
//               sender: "bot",
//               content:
//                 "Sorry, I encountered an error processing your request. Please try again.",
//               timestamp: new Date().toISOString(),
//             },
//           ]);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         // If not a health-related question
//         setTimeout(() => {
//           setMessages((prev) => [
//             ...prev,
//             {
//               id: Date.now() + 1,
//               sender: "bot",
//               content:
//                 "I am a health assistant. If you have any health issues, please describe your symptoms so I can help you.",
//               timestamp: new Date().toISOString(),
//             },
//           ]);
//         }, 500);
//       }
//     },
//     [userId, isDoctor, activeConversationId, conversations]
//   );

//   return {
//     messages,
//     loading,
//     conversations,
//     activeConversationId,
//     showConnectDoctorButton,
//     connectingToDoctor,
//     handleSendMessage,
//     handleConnectDoctor,
//     handleChangeConversation,
//   };
// };
