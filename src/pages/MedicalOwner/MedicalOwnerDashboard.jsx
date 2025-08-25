// src/pages/MedicalOwner/MedicalOwnerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// import MedicalOwnerProfile from "./MedicalOwnerProfile";

import {
  FaUserEdit,
  FaPills,
  FaFileInvoice,
  FaQrcode,
  FaSignOutAlt,
} from "react-icons/fa";

const DashboardCard = ({ icon: Icon, title, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer w-full h-64 rounded-3xl p-6 flex flex-col items-center justify-center
      bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl
      hover:bg-white/20 transition-all duration-300 ease-in-out"
  >
    <Icon className="text-5xl text-white mb-4" />
    <h3 className="text-2xl text-white font-semibold text-center">{title}</h3>
  </div>
);

const MedicalOwnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: `url('https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop')`,
      }}
    >
      <div className="max-w-7xl mx-auto bg-black bg-opacity-60 backdrop-blur-md rounded-3xl shadow-2xl p-10" style={{
        backgroundImage: `url('https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop')`,
      }}>
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Medical Owner Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <DashboardCard
            icon={FaUserEdit}
            title="Profile Summary"
            onClick={() => navigate("/medical-owner/profile")}
          />
          <DashboardCard
            icon={FaPills}
            title="Medicine Stock"
            onClick={() => navigate("/medical-owner/medicines")}
          />
          <DashboardCard
            icon={FaFileInvoice}
            title="Generate Bill"
            onClick={() => navigate("/medical-owner/generate-bill")}
          />
          <DashboardCard
            icon={FaQrcode}
            title="QR Code"
            onClick={() => navigate("/medical-owner/qr-code")}
          />
          <DashboardCard
            icon={FaSignOutAlt}
            title="Logout"
            onClick={() => navigate("/medical-owner/logout")}
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalOwnerDashboard;
