import React from "react";

const MessageContent: React.FC = () => {
  // Dữ liệu tin nhắn giả
  const messages = [
    {
      id: 1,
      sender: "John Doe",
      content: "Xin chào, tôi có câu hỏi về triệu chứng của tôi.",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "Tôi cần tư vấn về chẩn đoán gần đây của tôi.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "Làm thế nào để đặt lịch hẹn?",
      time: "2 days ago",
      unread: false,
    },
    {
      id: 4,
      sender: "Sarah Williams",
      content: "Cảm ơn bác sĩ vì lời khuyên!",
      time: "3 days ago",
      unread: false,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="bg-white rounded-lg shadow">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              message.unread ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium">{message.sender}</h3>
              <span className="text-xs text-gray-500">{message.time}</span>
            </div>
            <p className="text-gray-600 text-sm">{message.content}</p>
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
  );
};

export default MessageContent;
