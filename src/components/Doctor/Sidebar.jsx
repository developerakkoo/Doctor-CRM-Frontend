import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiBarChart2,
  FiCalendar,
  FiSettings,
  FiSidebar
} from "react-icons/fi";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { label: "Dashboard", icon: <FiGrid size={18} />, path: "/doctor/dashboard" },
    { label: "All Leads", icon: <FiUsers size={18} />, path: "/all-leads" },
    { label: "Add Lead", icon: <FiUserPlus size={18} />, path: "/add-lead" },
    { label: "Analytics", icon: <FiBarChart2 size={18} />, path: "/analytics" },
    { label: "Appointments", icon: <FiCalendar size={18} />, path: "/appointments" },
  ];

  const tools = [{ label: "Settings", icon: <FiSettings size={18} />, path: "/settings" }];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white border-r shadow-md z-50 flex flex-col justify-between p-2
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "w-20" : "w-60"}
        `}
      >
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-300 border-opacity-40">
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
            {/* Collapse button (desktop) */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <FiSidebar size={20} />
            </button>
          </div>

          {/* Main Menu */}
          <div>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Main</h3>
            )}
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-300
                      border-l-4
                      ${isActive(item.path)
                        ? "border-blue-500 text-blue-600 bg-blue-50 font-medium"
                        : "border-transparent text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tools Section */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Tools</h3>
          )}
          <ul className="space-y-2">
            {tools.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-300
                    border-l-4
                    ${isActive(item.path)
                      ? "border-blue-500 text-blue-600 bg-blue-50 font-medium"
                      : "border-transparent text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
