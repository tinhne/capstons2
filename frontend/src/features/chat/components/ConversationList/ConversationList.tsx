import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserConversations,
  deleteConversation,
  updateConversation,
} from "../../services/chatService";
import { Conversation } from "../../types";
import { formatDate } from "../../../../utils/formatDate";
import { useAuth } from "../../../../hooks/useAuth";
import userService from "../../../users/services/userService";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

interface ConversationListProps {
  onSelectConversation?: (conversation: Conversation) => void;
}

// Modal component
const EditModal: React.FC<{
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ open, value, onChange, onSave, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6"
            />
          </svg>
          Edit Title
        </h3>
        <input
          className="w-full border-2 border-blue-400 focus:ring-2 focus:ring-blue-300 px-3 py-2 rounded outline-none transition-all duration-150 mb-4"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter new title..."
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={onSave}
          >
            <svg
              className="h-5 w-5 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            <svg
              className="h-5 w-5 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userNames, setUserNames] = useState<{ [id: string]: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const fetchedConversations = await getUserConversations(user.id);
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

  // Fetch missing user names for other participants
  useEffect(() => {
    const idsToFetch = Array.from(
      new Set(
        conversations
          .map((c) => c.participantIds?.find((id) => id !== user?.id))
          .filter((id): id is string => !!id && !userNames[id])
      )
    );

    if (idsToFetch.length === 0) return;

    idsToFetch.forEach(async (id) => {
      try {
        const userInfo = await userService.fetchUserById(id);
        setUserNames((prev) => ({
          ...prev,
          [id]: userInfo.name || id,
        }));
      } catch {
        setUserNames((prev) => ({ ...prev, [id]: id }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, user?.id]);

  const handleSelectConversation = (conversation: Conversation) => {
    navigate(`/chat/${conversation.conversationId}`);
    setSelectedConversationId(conversation.conversationId);

    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!window.confirm("Are you sure you want to delete this conversation?"))
      return;
    try {
      await deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((c) => c.conversationId !== conversationId)
      );
    } catch (err) {
      alert("Failed to delete conversation!");
    }
  };

  const handleEditClick = (conversation: Conversation) => {
    setEditingId(conversation.conversationId);
    setNewTitle(conversation.title || "");
  };

  const handleEditSave = async (conversationId: string) => {
    try {
      const updated = await updateConversation(conversationId, newTitle);
      setConversations((prev) =>
        prev.map((c) =>
          c.conversationId === conversationId
            ? { ...c, title: updated.title }
            : c
        )
      );
      setEditingId(null);
    } catch (err) {
      alert("Failed to update title!");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setNewTitle("");
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
    <div className="bg-white shadow rounded-lg h-full flex flex-col">
      <h3 className="bg-blue-500 text-white font-bold py-2 px-4 rounded-t-lg">
        Recent Conversations
      </h3>
      <div className="flex-1 overflow-y-auto max-h-[75vh]">
        <ul className="divide-y divide-gray-200">
          {conversations.map((conversation) => {
            const otherParticipantId =
              conversation.participantIds?.find((id) => id !== user?.id) || "";

            const otherPersonName =
              userNames[otherParticipantId] || otherParticipantId;

            return (
              <li
                key={conversation.conversationId}
                className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between
                  ${
                    selectedConversationId === conversation.conversationId
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : ""
                  }
                `}
              >
                <div
                  className="flex items-center flex-1"
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg font-bold mr-3">
                    {otherPersonName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium text-gray-900">
                        {conversation.title || "New Chat"}
                      </h4>
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700 text-xs"
                        title="Edit title"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(conversation);
                        }}
                      >
                        <FaEdit />
                      </button>
                      {conversation.lastMessageTime && (
                        <p className="text-xs text-gray-500">
                          {formatDate(new Date(conversation.lastMessageTime))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className="ml-4 text-red-500 hover:text-red-700"
                  title="Delete conversation"
                  onClick={() =>
                    handleDeleteConversation(conversation.conversationId)
                  }
                >
                  <FaDeleteLeft />
                  {/* &#128465; */}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <EditModal
        open={!!editingId}
        value={newTitle}
        onChange={setNewTitle}
        onSave={() => handleEditSave(editingId!)}
        onCancel={handleEditCancel}
      />
    </div>
  );
};

export default ConversationList;
