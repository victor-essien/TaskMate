import React from "react";
import { RiSearchLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";

const Navbar: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-white shadow-sm">
      {/* Welcome Text */}
      <div className="text-lg font-medium text-abstract">
        Welcome, <br></br> <span className="font-semibold text-text">Brooklyn Simmons</span>
      </div>

      {/* Search Input */}
      <div className="flex items-center flex-grow max-w-2xl bg-text rounded-full shadow-sm px-4 py-4 mx-6">
        <RiSearchLine size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Find something"
          className="flex-grow pl-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none"
        />
        <button className="px-2 py-1 text-xs font-semibold text-gray-60 bg-gray-100 rounded-full">
          ⌘ K
        </button>
      </div>

      {/* Action Icons */}
      <div className="flex items-center space-x-4 text-gray-600">
        <BiUserCircle size={24} className="cursor-pointer hover:text-gray-800" />
        <IoMdNotificationsOutline
          size={24}
          className="cursor-pointer hover:text-gray-800"
        />
      </div>
    </div>
  );
};

export default Navbar;
