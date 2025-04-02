import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQueries = [
    "I have a fever and cough",
    "What might cause wheezing?",
    "I'm experiencing headache and fatigue",
  ];

  return (
    <div className="h-full p-4 flex flex-col">
      {/* Suggested Queries */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {suggestedQueries.map((query, index) => (
          <button
            key={index}
            onClick={() => onSendMessage(query)}
            className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded transition"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex w-full p-3 rounded-md bg-[#003D61]">
        <textarea
          placeholder="Describe your symptoms or ask a health question..."
          value={message}
          className="w-full bg-transparent text-white focus:outline-none resize-none h-10 pt-1.5"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 rounded-md hover:bg-blue-400 transition"
          disabled={!message.trim()}
        >
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABh0lEQVR4nO3WO2hVQRDG8dWoJIIpo/hIAhrExkasTKEg6WwESScWKjG1QbEQCwsrQRuDXZJOSxtBArkqgo1gwHQqikKCYhRSJPj4yepcONV9gOdckPy75Zzdb2Z2ZnZSWqdTYAB7qha9gF/+8gSj2FyF8CtcwkFMYgUfcRU7yhR+izOFdS/Oh0FruIfjpQvXwcYsGMI/8CIM2prKFC6CvbiBz/iKWxhMZQvXQTdO4yV+4hFOYENqB/SEF89wFn1t7D2K+/iOBYxjW6ubJ/EOd7EYXjzFBIZaPGM3rmMJ33Ab+xttOBlJc6yQTIdwLTI68zruczh/b2LAFpyK8AsH8npT8ad+fMm12uCgA7iM59FgPuAORrJIEyMOYwqreIOLf64BNcyhq0kk6wftxBgeRm3nzJ5uwYA+XMF7PO6UcK1zoe5YctUJD6otp0IDmcWDaCDbUxUNpF3+WcvMYAZHUgOwDzexjE/xYAyk/+JZVOEgMB/1Wvnocy4SpdphL4NdlY+366QS+Q0h32YNNS+ZoQAAAABJRU5ErkJggg=="
            alt="send"
            className={!message.trim() ? "opacity-50" : ""}
          />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
