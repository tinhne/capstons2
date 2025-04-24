import { useState, useEffect, useCallback } from "react";
import { ChatMessage, Conversation } from "../types";
import {
  startConversation,
  getChatHistory,
  getUserConversations,
} from "../services/chatApiService";
import {
  searchDisease,
  extractSymptoms,
  isHealthQuery,
} from "../services/chatService";
import {
  connectWebSocket,
  sendMessage as sendWebSocketMessage,
  disconnectWebSocket,
} from "../services/websocketService";

interface UseChatBotProps {
  userId?: string;
  doctorId?: string;
  isDoctor?: boolean;
}

export const useChatBot = ({
  userId,
  doctorId,
  isDoctor = false,
}: UseChatBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [showConnectDoctorButton, setShowConnectDoctorButton] = useState(false);
  const [connectingToDoctor, setConnectingToDoctor] = useState(false);

  // Khởi tạo cuộc trò chuyện và lấy lịch sử
  useEffect(() => {
    const initializeChat = async () => {
      if (userId) {
        try {
          // Lấy danh sách cuộc trò chuyện của người dùng
          setLoading(true);
          const userConversations = await getUserConversations(userId);
          setConversations(userConversations);

          // Nếu đang chat với bác sĩ cụ thể
          if (doctorId && !activeConversationId) {
            // Kiểm tra xem có cuộc trò chuyện nào với bác sĩ này chưa
            const existingConversation = userConversations.find(
              (conv) => conv.doctorId === doctorId
            );

            if (existingConversation) {
              setActiveConversationId(existingConversation.id);
              await loadChatHistory(existingConversation.id);
            } else if (doctorId) {
              // Tạo cuộc trò chuyện mới nếu chưa có
              const newConversation = await startConversation(doctorId, userId);
              setConversation(newConversation);
              setActiveConversationId(newConversation.id);

              // Thêm tin nhắn chào mừng
              setMessages([
                {
                  id: Date.now(),
                  sender: "bot",
                  content: "Chào mừng bạn đến với cuộc trò chuyện mới!",
                  conversationId: newConversation.id,
                },
              ]);
            }
          } else if (userConversations.length > 0 && !activeConversationId) {
            // Mặc định mở cuộc trò chuyện đầu tiên
            setActiveConversationId(userConversations[0].id);
            await loadChatHistory(userConversations[0].id);
          } else if (!doctorId && !activeConversationId) {
            // Nếu không có cuộc trò chuyện nào và không có doctorId, hiển thị chat với bot
            setMessages([
              {
                id: Date.now(),
                sender: "bot",
                content:
                  "Xin chào! Tôi là trợ lý sức khỏe. Bạn có thể mô tả triệu chứng để tôi giúp bạn tìm hiểu về tình trạng của mình.",
                timestamp: new Date().toISOString(),
              },
            ]);
          }
          setLoading(false);
        } catch (error) {
          console.error("Lỗi khi khởi tạo chat:", error);
          setLoading(false);
        }
      } else {
        // Nếu không có userId, hiện thông báo mặc định
        setMessages([
          {
            id: 1,
            sender: "bot",
            content: "Vui lòng đăng nhập để bắt đầu trò chuyện với bác sĩ.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };

    initializeChat();

    return () => {
      disconnectWebSocket();
    };
  }, [userId, doctorId]);

  // Kết nối WebSocket khi có activeConversationId
  useEffect(() => {
    if (activeConversationId && userId) {
      connectWebSocket(handleWebSocketMessage, activeConversationId);

      return () => {
        disconnectWebSocket();
      };
    }
  }, [activeConversationId, userId]);

  // Xử lý tin nhắn nhận được từ WebSocket
  const handleWebSocketMessage = (messageData: any) => {
    if (messageData && messageData.data) {
      const newMessage = messageData.data;
      // Chỉ thêm tin nhắn nếu thuộc về cuộc hội thoại hiện tại
      if (newMessage.conversationId === activeConversationId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    }
  };

  // Tải lịch sử chat
  const loadChatHistory = async (conversationId: string) => {
    try {
      setLoading(true);
      const history = await getChatHistory(conversationId);
      setMessages(history);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử chat:", error);
      setLoading(false);
    }
  };

  // Đổi cuộc trò chuyện
  const handleChangeConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    loadChatHistory(conversationId);
  }, []);

  // Kết nối với bác sĩ
  const handleConnectDoctor = useCallback(async () => {
    if (!userId) return;

    try {
      setConnectingToDoctor(true);
      setShowConnectDoctorButton(false);

      // Thêm tin nhắn đang kết nối
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "system",
          content: "Đang kết nối với bác sĩ trực tuyến...",
          timestamp: new Date().toISOString(),
        },
      ]);

      // Gọi API để kết nối với bác sĩ trực tuyến
      // TODO: Thay thế bằng API thực tế
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Giả định có bác sĩ trực tuyến
      const randomDoctorId = `doc-${Math.floor(Math.random() * 1000)}`;

      // Tạo cuộc trò chuyện mới với bác sĩ
      const newConversation = await startConversation(randomDoctorId, userId);

      // Cập nhật danh sách cuộc trò chuyện
      setConversations((prev) => [...prev, newConversation]);

      // Chuyển sang cuộc trò chuyện mới
      setActiveConversationId(newConversation.id);

      // Thêm tin nhắn chào mừng
      setMessages([
        {
          id: Date.now(),
          sender: "doctor",
          content:
            "Xin chào! Tôi là bác sĩ trực tuyến. Tôi có thể giúp gì cho bạn?",
          conversationId: newConversation.id,
          senderId: randomDoctorId,
          timestamp: new Date().toISOString(),
        },
      ]);

      setConnectingToDoctor(false);
    } catch (error) {
      console.error("Lỗi khi kết nối với bác sĩ:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "system",
          content: "Không thể kết nối với bác sĩ. Vui lòng thử lại sau.",
          timestamp: new Date().toISOString(),
        },
      ]);
      setConnectingToDoctor(false);
    }
  }, [userId]);

  // Gửi tin nhắn
  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) return;

      if (!userId) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "system",
            content: "Vui lòng đăng nhập để gửi tin nhắn.",
            timestamp: new Date().toISOString(),
          },
        ]);
        return;
      }

      const senderRole = isDoctor ? "doctor" : "user";

      // Với cuộc trò chuyện với bác sĩ
      if (activeConversationId) {
        const currentConversation = conversations.find(
          (conv) => conv.id === activeConversationId
        );

        if (!currentConversation) return;

        const receiverId = isDoctor
          ? currentConversation.userId
          : currentConversation.doctorId;

        // Tạo đối tượng tin nhắn
        const chatMessage: ChatMessage = {
          id: Date.now(),
          sender: senderRole,
          content: messageText,
          conversationId: activeConversationId,
          senderId: userId,
          receiverId: receiverId || "",
          timestamp: new Date().toISOString(),
        };

        // Thêm tin nhắn vào danh sách hiện tại (optimistic update)
        setMessages((prev) => [...prev, chatMessage]);

        // Gửi tin nhắn qua WebSocket
        sendWebSocketMessage(chatMessage);

        return;
      }

      // Xử lý chat với chatbot sức khỏe
      const userMessage: ChatMessage = {
        id: Date.now(),
        sender: "user",
        content: messageText,
        senderId: userId,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      if (isHealthQuery(messageText)) {
        setLoading(true);
        try {
          const symptoms = extractSymptoms(messageText);

          if (symptoms.length > 0) {
            const searchResults = await searchDisease({
              symptomNames: symptoms,
            });

            const botResponse: ChatMessage = {
              id: Date.now() + 1,
              sender: "bot",
              type: "disease-result",
              content:
                searchResults.matchedSymptomCount > 0
                  ? `Dựa trên triệu chứng của bạn (${symptoms.join(
                      ", "
                    )}), tôi tìm thấy ${
                      searchResults.diseases.length
                    } tình trạng có thể xảy ra.`
                  : "Tôi không thể nhận diện các tình trạng cụ thể dựa trên triệu chứng đó. Vui lòng thử các triệu chứng khác hoặc mô tả chi tiết hơn.",
              diseaseData: searchResults.diseases,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, botResponse]);

            // Hiển thị nút kết nối với bác sĩ nếu có kết quả
            if (searchResults.matchedSymptomCount > 0) {
              setTimeout(() => {
                setShowConnectDoctorButton(true);
              }, 1000);
            }
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                sender: "bot",
                content:
                  "Tôi không nhận ra triệu chứng nào trong tin nhắn của bạn. Vui lòng mô tả rõ hơn các triệu chứng bạn đang gặp phải (ví dụ: sốt, ho, đau đầu...).",
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        } catch (error) {
          console.error("Lỗi khi xử lý tin nhắn:", error);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: "bot",
              content:
                "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.",
              timestamp: new Date().toISOString(),
            },
          ]);
        } finally {
          setLoading(false);
        }
      } else {
        // Nếu không phải câu hỏi liên quan đến sức khỏe
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: "bot",
              content:
                "Tôi là trợ lý sức khỏe. Nếu bạn có bất kỳ vấn đề về sức khỏe, hãy mô tả triệu chứng để tôi có thể giúp bạn.",
              timestamp: new Date().toISOString(),
            },
          ]);
        }, 500);
      }
    },
    [userId, isDoctor, activeConversationId, conversations]
  );

  return {
    messages,
    loading,
    conversations,
    activeConversationId,
    showConnectDoctorButton,
    connectingToDoctor,
    handleSendMessage,
    handleConnectDoctor,
    handleChangeConversation,
  };
};
