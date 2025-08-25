// src/components/Sidebar.jsx
import { useNavigate } from "react-router-dom";
import { Stethoscope, Users, Building2 } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col py-8 px-6 shadow-xl h-screen">
      <h1 className="text-3xl font-bold mb-10 border-b pb-4">Doctor CRM</h1>
      <nav className="space-y-4">
        <button
          onClick={() => navigate("/doctor/login")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 w-full"
        >
          <Stethoscope size={20} />
          <span>Doctor</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded hover:bg-blue-700">
          <Users className="w-5 h-5" /> <span>Patient</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded hover:bg-blue-700">
          <Building2 className="w-5 h-5" /> <span>Medical Owner</span>
        </button>
      </nav>
    </aside>
  );
}
