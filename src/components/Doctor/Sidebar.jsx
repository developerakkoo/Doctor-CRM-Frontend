import React from "react";
import { Link } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiBarChart2,
  FiCalendar,
  FiFileText,
  FiActivity,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { label: "Dashboard", icon: <FiGrid size={18} />, path: "/doctor/dashboard" },
    { label: "All Leads", icon: <FiUsers size={18} />, path: "/all-leads" },
    { label: "Add Lead", icon: <FiUserPlus size={18} />, path: "/add-lead" },
    { label: "Analytics", icon: <FiBarChart2 size={18} />, path: "/analytics" },
    { label: "Appointments", icon: <FiCalendar size={18} />, path: "/appointments" },
  ];

  const tools = [
    { label: "Reports", icon: <FiFileText size={18} />, path: "/reports" },
    { label: "Activity", icon: <FiActivity size={18} />, path: "/activity" },
    { label: "Settings", icon: <FiSettings size={18} />, path: "/settings" },
  ];

  return (
    <div
      className={`h-screen ${
        collapsed ? "w-20" : "w-60"
      } bg-white border-r shadow-sm fixed top-0 left-0 p-4 transition-all duration-300 flex flex-col justify-between`}
    >
      {/* Top Section */}
      <div>
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between pb-3 w-full mb-5 border-b border-gray-300 border-opacity-40">
          {!collapsed && (
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
              <h1 className="text-lg font-semibold">MedLeads</h1>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-black"
          >
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        {/* Main */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
              Main
            </h3>
          )}
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center text-gray-700 space-x-3 hover:text-blue-600"
              >
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 w-full"
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tools (Bottom Section) */}
      <div>
        {!collapsed && (
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Tools
          </h3>
        )}
        <ul className="space-y-4">
          {tools.map((item) => (
            <li
              key={item.label}
              className="flex items-center text-gray-700 space-x-3 hover:text-blue-600"
            >
              <Link
                to={item.path}
                className="flex items-center space-x-3 w-full"
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
