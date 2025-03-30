import React, { useEffect } from "react";
import Chatbot from "./components/ChatBot";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from "react-router-dom";


const ChatPage: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if(!token){
      navigate("/auth");
    }
  }, [token, navigate]);
  return (
    <div className="flex w-full flex-col items-center justify-center min-h-screen bg-[#003554]">
      <Chatbot token={token || ''} />
      </div>
  );
};

export default ChatPage;
