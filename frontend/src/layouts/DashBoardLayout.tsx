import React from "react";
import { Outlet } from "react-router-dom";

const DashBoardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen min-w-screen">
      <Outlet />
    </div>
  );
};
export default DashBoardLayout;
