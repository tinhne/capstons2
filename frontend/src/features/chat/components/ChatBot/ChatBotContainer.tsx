import React, { useState, useEffect } from "react";
import ChatBotView from "./ChatBotView";
import { ChatMessage, DiagnosisData, UserChatDetail } from "../../types";
import {
  chatWithBot,
  connectToChat,
  disconnectFromChat,
  getChatHistory,
  sendMessage,
  checkDoctorInConversation,
  removeUserFromConversation,
  sendDiagnosisToDoctor,
} from "../../services/chatService";
import { useAuth } from "../../../../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import DoctorList from "../DoctorList";
import { User } from "../../../auth/types";

export interface ChatBotContainerProps {
  userId: string;
  doctorId?: string;
  isDoctor?: boolean;
  isBot?: boolean;
  conversationId?: string;
  user: User;
}

const ChatBotContainer: React.FC<ChatBotContainerProps> = ({
  userId,
  doctorId,
  isDoctor = false,
  isBot = false,
  conversationId,
  user,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldConnectDoctor, setShouldConnectDoctor] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [doctorAdded, setDoctorAdded] = useState(false);
  const [doctorLeft, setDoctorLeft] = useState(false);
  // Thêm state mới để lưu dữ liệu chuẩn đoán
  const [diagnosisData, setDiagnosisData] = useState<any>(null);
  const idBot = import.meta.env.VITE_BOT_ID;

  // Trong useEffect load chat history
  useEffect(() => {
    const loadHistory = async () => {
      if (conversationId) {
        setLoading(true);
        try {
          const history = await getChatHistory(conversationId);

          // Nếu là chat với bot và chưa có tin nhắn nào, thêm tin nhắn chào hỏi
          if (isBot && (!history || history.length === 0)) {
            const welcomeMessage: ChatMessage = {
              id: uuidv4(),
              sender: "bot",
              content: "Hello! What symptoms concern you today?",
              conversationId: conversationId,
              senderId: idBot,
              timestamp: new Date().toISOString(),
            };
            setMessages([welcomeMessage]);
          } else {
            setMessages(history || []);
          }

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
              "The doctor has left the conversation. You are now continuing the chat with the bot.",
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
  const parseDiagnosisData = (logString: string): DiagnosisData | null => {
    try {
      const parsedData = JSON.parse(logString);
      return {
        symptomStartTime: parsedData.symptomStartTime || "",
        age: parsedData.age || 0,
        gender: parsedData.gender || "",
        region: parsedData.region || "",
        symptoms: parsedData.symptoms || [],
        risk_factors: parsedData.risk_factors || [],
      };
    } catch (error) {
      console.error("Error parsing diagnosis data:", error);
      return null;
    }
  };
  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || !conversationId) return;

    // Tạo message user
    const message: ChatMessage = {
      id: uuidv4(),
      sender: isDoctor ? "doctor" : "user",
      content: inputValue.trim(),
      conversationId: conversationId,
      senderId: userId,
      timestamp: new Date().toISOString(),
    };

    const userChatDetail: UserChatDetail = {
      userMessage: message,
      age: user.age,
      gender: user.gender,
      underlying_disease: user.underlyingDisease,
    };

    setInputValue(""); // Clear input trước

    try {
      if (isBot && !doctorAdded) {
        // CHỈ khi chat với bot và không có bác sĩ tham gia
        // Thêm tin nhắn của người dùng vào state local
        setMessages((prevMessages) => [...prevMessages, message]);

        setLoading(true);
        setTimeout(async () => {
          const botResponse = await chatWithBot(idBot, userChatDetail);
          setMessages((prev) => [...prev, botResponse.data]);

          // ✅ Kích hoạt logic khi cần bác sĩ
          if (botResponse.needDoctor && !doctorAdded) {
            const diagnosisData = parseDiagnosisData(botResponse.log);

            setDiagnosisData(diagnosisData); // Lưu dữ liệu chuẩn đoán
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
    setDiagnosisData(null); // Clear diagnosis data
  };

  // ✅ Xử lý khi chọn bác sĩ từ danh sách - CHỈ GỬI DỮ LIỆU CHUẨN ĐOÁN
  const handleSelectDoctor = async (selectedDoctorId: string) => {
    if (!diagnosisData) return;

    setLoading(true);
    try {
      // ✅ CHỈ gửi dữ liệu chuẩn đoán cho bác sĩ - KHÔNG thêm vào cuộc trò chuyện
      await sendDiagnosisToDoctor(selectedDoctorId, diagnosisData);

      // Hiển thị thông báo thành công
      const systemMessage: ChatMessage = {
        id: uuidv4(),
        sender: "system",
        content: `✅ Your medical data has been sent to the doctor successfully. The doctor will review your case and may contact you soon.`,
        conversationId: conversationId || "",
        senderId: "system",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemMessage]);

      // Đóng danh sách bác sĩ và clear data
      setShowDoctorList(false);
      setDiagnosisData(null);
      setShouldConnectDoctor(false);

      // Hiển thị notification thành công
      alert("Đã gửi dữ liệu chuẩn đoán cho bác sĩ thành công!");
    } catch (error) {
      console.error("Failed to send diagnosis to doctor:", error);
      alert("Không thể gửi dữ liệu cho bác sĩ. Vui lòng thử lại.");
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

    if (window.confirm("Are you sure you want to leave this conversation?")) {
      setLoading(true);
      try {
        // Send notification that doctor left the conversation
        const leaveMessage: ChatMessage = {
          id: uuidv4(),
          sender: "system",
          content: "The doctor has left the conversation.",
          conversationId: conversationId,
          senderId: "system",
          timestamp: new Date().toISOString(),
        };

        // Gửi tin nhắn thông báo trước
        await sendMessage(leaveMessage);

        // Sau đó gọi API để xóa bác sĩ khỏi cuộc trò chuyện
        await removeUserFromConversation(conversationId, userId);

        // Redirect or show notification
      } catch (error) {
        console.error("Error leaving conversation:", error);
        alert("Unable to leave the conversation. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* ✅ Show confirmation dialog when bot suggests connecting to a doctor */}
      {shouldConnectDoctor && !doctorAdded && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Medical Consultation Recommended
              </h3>
              <p className="text-gray-700 mb-4">
                Based on your symptoms, our AI recommends sending your data to a
                doctor for proper diagnosis and treatment.
              </p>
              <p className="text-sm text-gray-600">
                Would you like to send your medical data to an available doctor
                now?
              </p>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handlePromptNo}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                No, continue with bot
              </button>
              <button
                onClick={handlePromptYes}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Yes, send to doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to show doctor list */}
      {showDoctorList && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <p>Select a doctor to send your diagnosis data:</p>
              <button
                onClick={() => setShowDoctorList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <DoctorList
              onSelectDoctor={handleSelectDoctor}
              // mode="send" // Thay đổi mode từ "add" thành "send"
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
        doctorAdded={doctorAdded}
        onLeaveConversation={isDoctor ? handleLeaveConversation : undefined}
        currentUserId={userId}
      />
    </>
  );
};

export default ChatBotContainer;
