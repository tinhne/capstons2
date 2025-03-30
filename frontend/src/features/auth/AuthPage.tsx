import React from "react";
import LoginForm from "./components/LoginForm";

const AuthPage: React.FC = () => {
  // const handleLogin = (data: { email: string; password: string }) => {
  //   console.log("Đăng nhập với:", data);
  //   // Gọi API đăng nhập tại đây
  // };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-white-100">
    //   <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
    //   <LoginForm />
    // </div>
    <div className="h-full w-full">
      <LoginForm />
    </div>
  );
};

export default AuthPage;
