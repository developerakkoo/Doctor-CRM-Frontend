import React, { useState } from "react";
import Sidebar from "../components/Doctor/Sidebar";
import Navbar from "../components/Doctor/Navbar";

const DoctorLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default DoctorLayout;
