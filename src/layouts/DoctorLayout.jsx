import React, { useState } from "react";
import Sidebar from "../components/Doctor/Sidebar";
import Navbar from "../components/Doctor/Navbar";

const DoctorLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 p-6 pt-20 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DoctorLayout;   // 👈 FIX: make sure this line exists
