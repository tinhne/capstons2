import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ChatBot from "./components/ChatBot/index";
import DoctorList from "./components/DoctorList/index";
import ConversationList from "./components/ConversationList/index";
import { chatService } from "./services";
import { UserRole } from "../users/types";

const ChatPage: React.FC = () => {
  const params = useParams();
  const conversationIdParam = params.id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isBotConversation, setIsBotConversation] = useState<boolean>(false);
  const [otherUserId, setOtherUserId] = useState<string | undefined>(undefined);

  // Lấy botId từ biến môi trường
  const botId = import.meta.env.VITE_BOT_ID;

  // Nếu không có người dùng đăng nhập, chuyển hướng đến trang đăng nhập
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/home${conversationIdParam ? `/${conversationIdParam}` : ""}`,
        },
      });
    }
  }, [navigate, conversationIdParam, user]);

  // Khi xác định isBotConversation và otherUserId
  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationIdParam || !user?.id) {
        setConversationId(null);
        setIsBotConversation(false);
        setOtherUserId(undefined);
        return;
      }

      setLoading(true);
      try {
        const conversation = await chatService.getConversationById(
          conversationIdParam
        );
        setConversationId(conversation.conversationId);

        // Xác định ai là người còn lại (không phải user hiện tại)
        const botId = import.meta.env.VITE_BOT_ID;
        const isBot = conversation.participantIds.includes(botId);
        setIsBotConversation(isBot);

        // Tìm id của người còn lại trong participantIds
        const otherParticipant = conversation.participantIds.find(
          (id) => id !== user.id
        );
        setOtherUserId(otherParticipant);
      } catch (err) {
        setError("Failed to load conversation.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationIdParam, user?.id]);

  // Handle doctor selection
  const handleDoctorSelect = async (selectedDoctorId: string) => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const conversation = await chatService.createConversation(
        user.id,
        selectedDoctorId
      );
      navigate(`/chat/${conversation?.conversationId}`);
    } catch (err: any) {
      setError("Failed to create conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle bot selection (luôn truyền botId)
  const handleBotSelect = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const conversation = await chatService.createConversation(user.id, botId);
      navigate(`/chat/${conversation.conversationId}`);
    } catch (err: any) {
      setError("Failed to create conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Đang chuyển hướng...
      </div>
    );
  }

  // Kiểm tra vai trò bác sĩ
  const isDoctor = user.roles?.some((role) => role.name === UserRole.DOCTOR);
  const isUser = user.roles?.some((role) => role.name === UserRole.USER);

  return (
    <>
      <div className="h-full w-full p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-3">Creating conversation...</p>
          </div>
        ) : conversationIdParam ? (
          conversationId ? (
            <ChatBot
              userId={user.id}
              doctorId={isBotConversation ? undefined : otherUserId}
              isBot={isBotConversation}
              isDoctor={isDoctor}
              conversationId={conversationId}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-red-500 mb-4">
                {error || "Unable to start conversation. Please try again."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Retry
              </button>
            </div>
          )
        ) : (
          // Hiển thị danh sách các cuộc trò chuyện và tùy chọn chat
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Danh sách cuộc trò chuyện */}
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Your Conversations
              </h1>
              <ConversationList />
            </div>

            {/* Tùy chọn chat cho người dùng thông thường */}
            {(!params.id || params.id === "") && isUser && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Chat Options
                </h1>
                {/* Tùy chọn chat với bot */}
                <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                  <h2 className="text-xl font-semibold mb-3">
                    Health Assistant
                  </h2>
                  <p className="text-gray-600 mb-3">
                    Chat with our AI health assistant to get general health
                    information
                  </p>
                  <button
                    onClick={handleBotSelect}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Start Chat
                  </button>
                </div>

                {/* Danh sách bác sĩ có sẵn */}
                <h1 className="text-2xl font-bold text-gray-800 mt-6">
                  Available Doctors
                </h1>
                <DoctorList onSelectDoctor={handleDoctorSelect} />
              </div>
            )}

            {/* Chỉ hiển thị danh sách bác sĩ cho người không phải user hoặc doctor */}
            {!isUser && !isDoctor && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Available Doctors
                </h1>
                <DoctorList onSelectDoctor={handleDoctorSelect} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPage;
