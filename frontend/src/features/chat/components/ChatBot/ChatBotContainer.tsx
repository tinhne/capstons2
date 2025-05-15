import React, { useState, useEffect } from "react";
import ChatBotView from "./ChatBotView";
import { ChatMessage } from "../../types";
import {
  chatWithBot,
  connectToChat,
  disconnectFromChat,
  getChatHistory,
  sendMessage,
  addUserToConversation,
  checkDoctorInConversation,
  removeUserFromConversation,
} from "../../services/chatService";
import { useAuth } from "../../../../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import DoctorList from "../DoctorList";

export interface ChatBotContainerProps {
  userId: string;
  doctorId?: string;
  isDoctor?: boolean;
  isBot?: boolean;
  conversationId?: string;
}

const ChatBotContainer: React.FC<ChatBotContainerProps> = ({
  userId,
  doctorId,
  isDoctor = false,
  isBot = false,
  conversationId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldConnectDoctor, setShouldConnectDoctor] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const { user } = useAuth();
  const [doctorAdded, setDoctorAdded] = useState(false);
  const [doctorLeft, setDoctorLeft] = useState(false);
  const idBot = import.meta.env.VITE_BOT_ID;
  // Trong useEffect load chat history
  useEffect(() => {
    const loadHistory = async () => {
      if (conversationId) {
        setLoading(true);
        try {
          const history = await getChatHistory(conversationId);
          setMessages(history || []);

          // Kiểm tra xem có bác sĩ trong cuộc trò chuyện không
          if (isBot) {
            const hasDoctorInConversation = await checkDoctorInConversation(
              conversationId
            );
            setDoctorAdded(hasDoctorInConversation);
            setDoctorLeft(!hasDoctorInConversation);
            // Nếu đã có bác sĩ, đảm bảo không hiện prompt kết nối
            if (hasDoctorInConversation) {
              setShouldConnectDoctor(false);
            }
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadHistory();
  }, [conversationId, isBot]);

  // Connect to WebSocket for real-time chat
  useEffect(() => {
    if (user && conversationId) {
      connectToChat(user.id, conversationId, handleReceiveMessage);
    }

    // Cleanup when component unmounts
    return () => {
      disconnectFromChat();
    };
  }, [user, conversationId]);

  const handleReceiveMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => {
      // Kiểm tra có tin nhắn nào có cùng ID chưa
      const isDuplicate = prevMessages.some((m) => m.id === message.id);
      if (isDuplicate) {
        return prevMessages; // Không thêm nếu đã có
      }
      return [...prevMessages, message]; // Thêm mới nếu chưa có
    });
  };
  // Thêm vào useEffect để kiểm tra bác sĩ còn trong cuộc trò chuyện không
  useEffect(() => {
    if (!isBot || !conversationId || !doctorAdded) return;

    // Nếu đã có bác sĩ tham gia, thiết lập interval để kiểm tra bác sĩ còn trong cuộc trò chuyện không
    const checkInterval = setInterval(async () => {
      try {
        const hasDoctorInConversation = await checkDoctorInConversation(
          conversationId
        );

        if (!hasDoctorInConversation && doctorAdded) {
          // Bác sĩ đã rời đi
          setDoctorLeft(true);
          setDoctorAdded(false);

          // Hiển thị thông báo
          const systemMessage: ChatMessage = {
            id: uuidv4(),
            sender: "system",
            content:
              "Bác sĩ đã rời khỏi cuộc trò chuyện. Bạn đang tiếp tục chat với bot.",
            conversationId: conversationId,
            senderId: "system",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, systemMessage]);

          // Dừng interval
          clearInterval(checkInterval);
        }
      } catch (error) {
        console.error("Error checking doctor status:", error);
      }
    }, 10000); // Kiểm tra mỗi 10 giây

    return () => clearInterval(checkInterval);
  }, [isBot, conversationId, doctorAdded]);
  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || !conversationId) return;

    // Xác định người nhận tin nhắn
    let receiverId = "";

    if (isBot) {
      if (doctorAdded && !doctorLeft) {
        receiverId = "all";
      } else {
        receiverId = "bot";
      }
    } else {
      receiverId = doctorId || "";
    }

    // Tạo message user
    const message: ChatMessage = {
      id: uuidv4(),
      sender: isDoctor ? "doctor" : "user",
      content: inputValue.trim(),
      conversationId: conversationId,
      senderId: userId,
      timestamp: new Date().toISOString(),
    };

    setInputValue(""); // Clear input trước

    try {
      if (isBot && !doctorAdded) {
        // CHỈ khi chat với bot và không có bác sĩ tham gia
        // Thêm tin nhắn của người dùng vào state local
        setMessages((prevMessages) => [...prevMessages, message]);

        setLoading(true);
        setTimeout(async () => {
          const botResponse = await chatWithBot(idBot, message);
          setMessages((prev) => [...prev, botResponse.data]);

          if (botResponse.needDoctor && !doctorAdded) {
            setShouldConnectDoctor(true);
          }

          setLoading(false);
        }, 1000);
      } else {
        // Với trường hợp khác (chat với user hoặc bác sĩ), KHÔNG thêm vào state local
        // Sẽ nhận lại tin nhắn qua WebSocket
        setLoading(true);
        await sendMessage(message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  // Người dùng chọn YES để kết nối với bác sĩ
  const handlePromptYes = () => {
    setShowDoctorList(true); // Hiển thị danh sách bác sĩ
    setShouldConnectDoctor(false); // Ẩn prompt
  };

  // Người dùng chọn NO để từ chối kết nối với bác sĩ
  const handlePromptNo = () => {
    setShouldConnectDoctor(false);
  };

  // Xử lý khi chọn bác sĩ từ danh sách
  const handleSelectDoctor = async (selectedDoctorId: string) => {
    if (!conversationId) return;

    setLoading(true);
    try {
      // Thêm bác sĩ vào cuộc trò chuyện hiện tại
      await addUserToConversation(conversationId, selectedDoctorId);

      // Đánh dấu là bác sĩ đã được thêm vào
      setDoctorAdded(true);

      // Hiển thị thông báo hệ thống
      const systemMessage: ChatMessage = {
        id: uuidv4(),
        sender: "system",
        content: `Bác sĩ đã tham gia cuộc trò chuyện. Vui lòng tiếp tục cuộc trò chuyện với bác sĩ.`,
        conversationId: conversationId,
        senderId: "system",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemMessage]);

      // Đóng danh sách bác sĩ
      setShowDoctorList(false);
    } catch (error) {
      console.error("Failed to add doctor:", error);
      alert("Không thể thêm bác sĩ vào cuộc trò chuyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const handleLeaveConversation = async () => {
    if (!conversationId || !userId) return;

    if (window.confirm("Bạn có chắc muốn thoát khỏi cuộc trò chuyện này?")) {
      setLoading(true);
      try {
        // Gửi thông báo bác sĩ rời khỏi cuộc trò chuyện
        const leaveMessage: ChatMessage = {
          id: uuidv4(),
          sender: "system",
          content: "Bác sĩ đã rời khỏi cuộc trò chuyện.",
          conversationId: conversationId,
          senderId: "system",
          timestamp: new Date().toISOString(),
        };

        // Gửi tin nhắn thông báo trước
        await sendMessage(leaveMessage);

        // Sau đó gọi API để xóa bác sĩ khỏi cuộc trò chuyện
        await removeUserFromConversation(conversationId, userId);

        // Chuyển hướng hoặc hiển thị thông báo
      } catch (error) {
        console.error("Error leaving conversation:", error);
        alert("Không thể thoát khỏi cuộc trò chuyện. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <>
      {/* Hiển thị hộp thoại xác nhận khi bot đề xuất kết nối với bác sĩ */}
      {shouldConnectDoctor && !doctorAdded && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Bạn có muốn kết nối với bác sĩ không?</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handlePromptYes}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={handlePromptNo}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal hiển thị danh sách bác sĩ */}
      {showDoctorList && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <p>Chọn bác sĩ để thêm vào cuộc trò chuyện:</p>
              <button
                onClick={() => setShowDoctorList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <DoctorList
              onSelectDoctor={handleSelectDoctor}
              mode="add" // Quan trọng: Đặt mode="add" để không tạo conversation mới
            />
          </div>
        </div>
      )}

      <ChatBotView
        messages={messages || []}
        inputValue={inputValue}
        loading={loading}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isDoctor={isDoctor}
        userId={userId}
        doctorId={doctorId}
        isBot={isBot}
        shouldConnectDoctor={shouldConnectDoctor}
        doctorAdded={doctorAdded} // Truyền prop mới
        onLeaveConversation={isDoctor ? handleLeaveConversation : undefined}
        currentUserId={userId} // Thêm dòng này
      />
    </>
  );
};

export default ChatBotContainer;
