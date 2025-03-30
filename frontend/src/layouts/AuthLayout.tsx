import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="bg-zinc-950 min-h-screen">
        <Outlet />
    </div>
  );
};

export default AuthLayout;
