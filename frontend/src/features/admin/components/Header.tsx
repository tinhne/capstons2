import React, { useEffect, useState } from "react";
import userService from "../../users/services/userService";
import { UserProfile } from "../../users/types";

const Header: React.FC = () => {
  const [admin, setAdmin] = useState<UserProfile | null>(null);

  useEffect(() => {
    userService
      .fetchMyInfo()
      .then(setAdmin)
      .catch(() => setAdmin(null));
  }, []);

  return (
    <div className="flex flex-row items-center justify-end px-10 py-5 bg-white shadow rounded-b-xl border-b border-gray-100 min-h-[80px]">
      {admin ? (
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end mr-4">
            <span className="font-semibold text-gray-800 text-lg">
              {admin.name}
            </span>
            <span className="text-blue-500 text-xs font-medium">
              {admin.roles?.map((role) => (
                <span key={role.name} className="badge">
                  {role.name}
                </span>
              ))}
            </span>
            <span className="text-gray-500 text-xs">{admin.email}</span>
          </div>
          <img
            src={"/vite.svg"}
            className="w-12 h-12 rounded-full border-2 border-blue-500 shadow object-cover"
            alt="Avatar"
          />
        </div>
      ) : (
        <div className="text-gray-400">Loading admin information...</div>
      )}
    </div>
  );
};

export default Header;
