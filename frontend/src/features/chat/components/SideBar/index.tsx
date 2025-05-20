import React from "react";
import { Conversation } from "../../types";
import ConversationItem from "./ConversationItem";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  isCollapsed = false,
  toggleCollapse,
}) => {
  if (isCollapsed) {
    return (
      <div className="w-[60px] border-r bg-gray-50 h-full flex flex-col items-center py-4">
        <button
          onClick={toggleCollapse}
          className="mb-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
        {conversations.length > 0 ? (
          <div className="w-full">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`w-full flex justify-center p-3 ${
                  activeConversationId === conversation.id
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                  {(conversation.title || "").charAt(0).toUpperCase() || "D"}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-1/4 border-r bg-gray-50 h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Conversations</h2>
        {toggleCollapse && (
          <button
            onClick={toggleCollapse}
            className="p-1 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-500 text-center">No conversations yet.</p>
          <p className="text-gray-400 text-sm text-center mt-1">
            Send a message to start a new conversation
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
