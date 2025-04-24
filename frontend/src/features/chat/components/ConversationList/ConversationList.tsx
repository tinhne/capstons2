import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserConversations } from "../../services/chatService";
import { Conversation } from "../../types";
import { formatDate } from "../../../../utils/formatDate";
import { useAuth } from "../../../../hooks/useAuth";
import { UserRole } from "../../../../types/user";

interface ConversationListProps {
  onSelectConversation?: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log("user", user);
    const fetchConversations = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const fetchedConversations = await getUserConversations(user.id);
        console.log("check conversations", fetchedConversations);
        setConversations(fetchedConversations || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to load conversations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id]);

  const handleSelectConversation = (conversation: Conversation) => {
    // Depending on user role, navigate to the appropriate chat
    // const isDoctor = user?.roles === "DOCTOR";
    // const isDoctor = user?.roles?.some((role) => role.name === UserRole.DOCTOR);

    // const targetId = isDoctor ? conversation.userId : conversation.doctorId;

    // Navigate to chat with doctor/user
    navigate(`/chat/${conversation.conversationId}`);

    // Call the onSelectConversation prop if provided
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div
        className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">
          You don't have any conversations yet.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <h3 className="bg-blue-500 text-white font-bold py-2 px-4 rounded-t-lg">
        Recent Conversations
      </h3>
      <ul className="divide-y divide-gray-200">
        {conversations.map((conversation) => {
          const isDoctor = user?.role === "DOCTOR";
          const otherPersonName = isDoctor
            ? conversation.userName || "User"
            : conversation.doctorName || "Doctor";

          return (
            <li
              key={conversation.conversationId}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg font-bold mr-3">
                  {otherPersonName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium text-gray-900">
                      {otherPersonName}
                    </h4>
                    {conversation.lastMessageTime && (
                      <p className="text-xs text-gray-500">
                        {formatDate(new Date(conversation.lastMessageTime))}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConversationList;
