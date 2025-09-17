import React, { useState } from "react";
import Sidebar from "../components/Doctor/Sidebar";
import Navbar from "../components/Doctor/Navbar";

const DoctorLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false); // Desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${collapsed ? "md:ml-20" : "md:ml-60"} ml-0
        `}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={() => setMobileOpen(!mobileOpen)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
