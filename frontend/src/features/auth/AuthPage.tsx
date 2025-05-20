import React from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
// import { APP_ROUTES } from "../../constants/routeConstants";

const AuthPage: React.FC = () => {
  const location = useLocation();
  const isRegisterRoute = location.pathname.includes("register");

  return (
    <div className="h-full w-full">
      {isRegisterRoute ? <RegisterForm /> : <LoginForm />}
    </div>
  );
};

export default AuthPage;
