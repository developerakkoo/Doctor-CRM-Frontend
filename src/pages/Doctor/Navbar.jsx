import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
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

        {/* (Optional Right side buttons/links later) */}
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;
