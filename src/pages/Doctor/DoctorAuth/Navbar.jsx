import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="w-full flex justify-between items-center p-4">
        {/* Logo on left */}
        <div className="flex items-center space-x-2">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#0EA5E9" />
            <path
              d="M10 20h4l2 5 4-10 2 5h8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-bold text-blue-600">MedLeads</span>
        </div>

        {/* Login & Register buttons on far right */}
        <div className="flex space-x-3 ml-auto">
          <Link to="/">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              Login
            </button>
          </Link>
          <Link to="/doctor/register">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
