import React from "react";
import { BarChart3, Stethoscope, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // ✅ Fix: now navigate will work

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-8 px-6 shadow-xl">
        <h1 className="text-3xl font-bold mb-10 border-b pb-4">Doctor CRM</h1>
        <nav className="space-y-4">
          <button
            onClick={() => navigate("/doctor/login")}
            className="flex items-center gap-3 px-4 py-3 rounded hover:bg-blue-700 w-full"
          >
            <Stethoscope className="w-5 h-5" />
            <span>Doctor</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded hover:bg-blue-700 w-full">
            <Users className="w-5 h-5" />
            <span>Patient</span>
          </button>

          <button
            onClick={() => navigate('/medical-owner/login')}
            className="flex items-center gap-3 px-4 py-3 rounded hover:bg-blue-700 w-full">
            Medical Owner
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-semibold mb-8">Dashboard Overview</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-gray-700">Total Doctors</h3>
              <Stethoscope className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-800">56</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-gray-700">Total Patients</h3>
              <Users className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-700">342</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-gray-700">Medical Owners</h3>
              <Building2 className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-700">18</p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="mt-12">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Reports</h3>
              <BarChart3 className="text-gray-500" />
            </div>
            <div className="text-gray-500">(Add a chart component here later)</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
