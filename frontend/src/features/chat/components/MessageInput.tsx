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

  return (
    <div className="h-full p-10 flex items-center">
      <div className="flex w-full p-5 rounded-md bg-[#003D61]">
        <input
          type="text"
          placeholder="How can I help you?"
          value={message}
          className="w-full bg-transparent  text-white focus:outline-none"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 rounded-md hover:bg-blue-400 transition"
        >
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABh0lEQVR4nO3WO2hVQRDG8dWoJIIpo/hIAhrExkasTKEg6WwESScWKjG1QbEQCwsrQRuDXZJOSxtBArkqgo1gwHQqikKCYhRSJPj4yepcONV9gOdckPy75Zzdb2Z2ZnZSWqdTYAB7qha9gF/+8gSj2FyF8CtcwkFMYgUfcRU7yhR+izOFdS/Oh0FruIfjpQvXwcYsGMI/8CIM2prKFC6CvbiBz/iKWxhMZQvXQTdO4yV+4hFOYENqB/SEF89wFn1t7D2K+/iOBYxjW6ubJ/EOd7EYXjzFBIZaPGM3rmMJ33Ab+xttOBlJc6yQTIdwLTI68zruczh/b2LAFpyK8AsH8npT8ad+fMm12uCgA7iM59FgPuAORrJIEyMOYwqreIOLf64BNcyhq0kk6wftxBgeRm3nzJ5uwYA+XMF7PO6UcK1zoe5YctUJD6otp0IDmcWDaCDbUxUNpF3+WcvMYAZHUgOwDzexjE/xYAyk/+JZVOEgMB/1Wvnocy4SpdphL4NdlY+366QS+Q0h32YNNS+ZoQAAAABJRU5ErkJggg=="
            alt="sent"
          />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
