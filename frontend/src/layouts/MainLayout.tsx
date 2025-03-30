import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen min-w-screen">
      <Outlet />
    </div>
  );
};

export default MainLayout;
