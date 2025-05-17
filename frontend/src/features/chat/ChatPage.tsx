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
        selectedDoctorId,
        ""
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
      const conversation = await chatService.createConversation(
        user.id,
        botId,
        "New Chat"
      );
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
    <div className="flex h-[85vh] w-full box-border bg-gradient-to-br from-blue-50 to-green-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r shadow-xl rounded-2xl m-4 p-4 space-y-8 box-border transition-all">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto pr-1">
            <ConversationList />
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <section className="flex-1 flex flex-col items-center justify-center h-full py-6 px-2">
        <div className="w-full max-w-3xl flex flex-col h-full justify-center">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 shadow">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-lg text-blue-600 font-semibold">
                Đang xử lý...
              </p>
            </div>
          ) : conversationIdParam ? (
            conversationId ? (
              <div className="flex-1 flex flex-col justify-end">
                <div className="h-full flex items-center justify-center">
                  <div className="w-full h-[800px] max-h-[80vh] box-border">
                    <ChatBot
                      userId={user.id}
                      doctorId={isBotConversation ? undefined : otherUserId}
                      isBot={isBotConversation}
                      isDoctor={isDoctor}
                      conversationId={conversationId}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 mb-4">
                  {error || "Unable to start conversation. Please try again."}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Thử lại
                </button>
              </div>
            )
          ) : (
            <div className="space-y-8">
              {/* Chat Options */}
              {isUser && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6 flex flex-col gap-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Chọn hình thức chat
                  </h2>
                  <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
                    {/* Chat with Bot */}
                    <div className="flex-1 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 shadow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Trợ lý sức khỏe AI
                        </h3>
                        <p className="text-gray-600 mb-3">
                          Chat với AI để nhận thông tin sức khỏe tổng quát.
                        </p>
                      </div>
                      <button
                        onClick={handleBotSelect}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition mt-2"
                      >
                        Bắt đầu chat
                      </button>
                    </div>
                    {/* Chat with Doctor */}
                    <div className="flex-1 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-6 shadow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Bác sĩ trực tuyến
                        </h3>
                        <p className="text-gray-600 mb-3">
                          Chọn bác sĩ để tư vấn trực tiếp.
                        </p>
                      </div>
                      <DoctorList onSelectDoctor={handleDoctorSelect} />
                    </div>
                  </div>
                </div>
              )}
              {/* Only show doctors for non-user/non-doctor */}
              {!isUser && !isDoctor && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Bác sĩ trực tuyến
                  </h2>
                  <DoctorList onSelectDoctor={handleDoctorSelect} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
