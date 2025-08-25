import React, { useState } from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import defaultProfile from "../../assets/defaultProfile.png"; // Replace with your image path

const PatientNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-3 pb-5 bg-white  fixed top-0 left-64 right-0 ">
        {/* <h1 className="text-xl font-bold text-blue-600">Patient Dashboard</h1> */}
      </div>

      {/* Search bar */}
      <div className="flex-1 mx-8 max-w-lg relative">
  <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <FiSearch className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search doctors, appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-gray-700"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="relative">
          <FiBell size={22} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2"
          >
            <img
              src={defaultProfile}
              alt="Profile"
              className="w-8 h-8 rounded-full border"
            />
            <span className="text-gray-700 font-medium">Hi, John</span>
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md z-50">
              <ul className="py-2 text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Settings
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PatientNavbar;
