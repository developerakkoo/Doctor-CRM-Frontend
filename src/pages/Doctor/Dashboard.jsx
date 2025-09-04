import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate
import Sidebar from "../../components/Doctor/Sidebar";
import Navbar from "../../components/Doctor/Navbar";
import StatCards from "../../components/Doctor/StatCards";
import RecentLeads from "../../components/Doctor/RecentLeads";
import QuickActions from "../../components/Doctor/QuickActions";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [doctorName, setDoctorName] = useState("Dr. Smith");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ hook for navigation

  // Get doctorId and token from localStorage
  const doctorId = localStorage.getItem("doctorId");
  const token = localStorage.getItem("doctorToken");

 

useEffect(() => {
  if (!doctorId) {
    setError("DoctorID not found. Please login.");
    setLoading(false);
    return;
  }

  if (!token) {
    setError("Authentication token not found. Please login.");
    setLoading(false);
    return;
  }

  fetch(`http://localhost:9191/api/v1/doctors/profile/${doctorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch doctor profile");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Doctor profile data:", data);

      if (data && data.data && data.data.name) {
        setDoctorName(data.data.name);
      } else {
        setDoctorName("Dr. Smith");
      }

      // ✅ Show toast only once on successful login
      toast.success("Login successful! Welcome to your dashboard 🎉", {
        id: "login-success", // prevents duplicate toasts
      });

      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching doctor profile:", err);
      setError("Error fetching doctor profile");
      toast.error("Failed to load doctor profile ❌");
      setLoading(false);
    });
}, [doctorId, token]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-teal-50">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen pt-18 px-8 pb-8">
        <Navbar />

        <div className="flex justify-between items-center mt-4 ">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {doctorName}</h2>
            <p className="text-gray-600">Here's what's happening with your leads today.</p>
          </div>

          {/* ✅ Navigate to Add Lead Page */}
          <button
            onClick={() => navigate("/add-lead")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <UserPlus size={18} />
            <span>Add New Lead</span>
          </button>
        </div>

        <StatCards />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          <div className="xl:col-span-2">
            <RecentLeads />
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
