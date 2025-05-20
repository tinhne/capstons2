import React from "react";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <>
      {isOpen ? (
        <div className="h-full w-1/4 bg-[#FFFFFF] text-black p-4 border-r rounded-[10px]">
          <div className="flex items-center justify-between pb-2">
            <button
              className="p-2 rounded-md hover:bg-gray-200 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <GoSidebarExpand size={27} />
            </button>
          </div>
          <h3 className="text-lg font-semibold">History</h3>
          <ul className="mt-4 space-y-2">
            <li className="p-2 text-xl rounded-md hover:bg-gray-200 cursor-pointer">
              Untitled Prompt
            </li>
          </ul>
        </div>
      ) : (
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <GoSidebarCollapse size={27} color="white"/>
            </button>
      )}
    </>
  );
};

export default Sidebar;
