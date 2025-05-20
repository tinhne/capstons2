import React, { useState } from "react";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  unread: boolean;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "admin";
  timestamp: string;
}

const MessageContent: React.FC = () => {
  // Sample message data
  const messages = [
    {
      id: 1,
      sender: "John Doe",
      content: "Hello, I have a question about my symptoms.",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "I need advice about my recent diagnosis.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "How can I make an appointment?",
      time: "2 days ago",
      unread: false,
    },
    {
      id: 4,
      sender: "Sarah Williams",
      content: "Thank you, doctor, for your advice!",
      time: "3 days ago",
      unread: false,
    },
  ];

  // Chat messages for each conversation
  const [chatData, setChatData] = useState<Record<number, ChatMessage[]>>({
    1: [
      {
        id: 1,
        text: "Hello, I have a question about my symptoms.",
        sender: "user",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        text: "Yes, how can I help you?",
        sender: "admin",
        timestamp: "10:31 AM",
      },
    ],
    2: [
      {
        id: 1,
        text: "I need advice about my recent diagnosis.",
        sender: "user",
        timestamp: "Yesterday",
      },
      {
        id: 2,
        text: "Can you share more details?",
        sender: "admin",
        timestamp: "Yesterday",
      },
    ],
    3: [
      {
        id: 1,
        text: "How can I make an appointment?",
        sender: "user",
        timestamp: "2 days ago",
      },
    ],
    4: [
      {
        id: 1,
        text: "Thank you, doctor, for your advice!",
        sender: "user",
        timestamp: "3 days ago",
      },
      {
        id: 2,
        text: "You're welcome, happy to help!",
        sender: "admin",
        timestamp: "3 days ago",
      },
    ],
  });

  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleMessageClick = (messageId: number) => {
    setSelectedConversation(messageId);
    // Mark message as read when selected
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, unread: false } : msg
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || selectedConversation === null) return;

    const newChatMessage: ChatMessage = {
      id: chatData[selectedConversation].length + 1,
      text: newMessage,
      sender: "admin",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatData((prevData) => ({
      ...prevData,
      [selectedConversation]: [
        ...prevData[selectedConversation],
        newChatMessage,
      ],
    }));

    setNewMessage("");
  };

  return (
    <div className="p-4 flex h-[calc(100vh-80px)]">
      {/* Conversations List */}
      <div className="w-1/3 pr-4">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <div className="bg-white rounded-lg shadow overflow-y-auto max-h-[calc(100vh-150px)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                message.unread ? "bg-blue-50" : ""
              } ${selectedConversation === message.id ? "bg-gray-100" : ""}`}
              onClick={() => handleMessageClick(message.id)}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium">{message.sender}</h3>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
              <p className="text-gray-600 text-sm truncate">
                {message.content}
              </p>
              {message.unread && (
                <div className="mt-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 bg-white rounded-lg shadow flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold">
                {messages.find((m) => m.id === selectedConversation)?.sender}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {chatData[selectedConversation]?.map((chatMessage) => (
                <div
                  key={chatMessage.id}
                  className={`mb-4 max-w-[70%] ${
                    chatMessage.sender === "admin"
                      ? "ml-auto bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                      : "mr-auto bg-gray-200 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                  } p-3`}
                >
                  <p>{chatMessage.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      chatMessage.sender === "admin"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {chatMessage.timestamp}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContent;
