import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiHome, FiCalendar, FiFileText } from "react-icons/fi";

import PatientNavbar from "../pages/Patient/PatientNavbar"; // adjust path

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { label: "Dashboard", path: "/pdashboard", icon: <FiHome /> },
    { label: "Appointment", path: "/patient/appointment", icon: <FiCalendar /> },
    { label: "Medications", path: "/medications", icon: <FiFileText /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`h-screen ${
          collapsed ? "w-20" : "w-60"
        } bg-white border-r shadow-sm fixed top-0 left-0 p-4 transition-all duration-300`}
      >
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between pb-3 w-full mb-5 border-b border-gray-300 border-opacity-40 ">
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
              <h1 className="text-lg font-semibold">Doctor CRM</h1>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-black"
          >
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        {/* Menu */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 ">
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
      </aside>


     {/* Main content */}
<main
  className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-60"}`}
>
  {/* Navbar */}
  <PatientNavbar />

  {/* Page content */}
  <div className="mt-6">
    {children}
  </div>
</main>

    </div>
  );
};

export default DashboardLayout;
