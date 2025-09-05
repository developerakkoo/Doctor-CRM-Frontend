import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCards from "../../components/Doctor/StatCards";
import RecentLeads from "../../components/Doctor/RecentLeads";
import QuickActions from "../../components/Doctor/QuickActions";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [doctorName, setDoctorName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Get token + user from localStorage
  const token = localStorage.getItem("doctorToken");
  const doctorId = localStorage.getItem("doctorId");
  const storedUser = localStorage.getItem("doctorUser");

  useEffect(() => {
    if (!token) {
      setError("Session expired or not found. Please login again.");
      setLoading(false);
      return;
    }

    // ✅ If Google login already saved full user object
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setDoctorName(user.name || "Doctor");

        toast.success(`Welcome back, ${user.name || "Doctor"} 🎉`, {
          id: "login-success",
        });

        setLoading(false);
        return; // stop here, no need to call API again
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }

    // ✅ Otherwise fetch from backend using doctorId
    if (doctorId) {
      fetch(`http://localhost:9191/api/v1/doctors/profile/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch doctor profile");
          return res.json();
        })
        .then((data) => {
          console.log("Doctor profile data:", data);
          if (data?.data?.name) {
            setDoctorName(data.data.name);
          } else {
            setDoctorName("Doctor");
          }

          toast.success(`Welcome back, ${data?.data?.name || "Doctor"} 🎉`, {
            id: "login-success",
          });

          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching doctor profile:", err);
          setError("Error fetching doctor profile");
          toast.error("Failed to load doctor profile ❌");
          setLoading(false);
        });
    } else {
      setError("Doctor ID missing. Please login again.");
      setLoading(false);
    }
  }, [doctorId, token, storedUser]);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("doctorId");
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 font-semibold space-y-4">
        <p>{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {doctorName}</h2>
          <p className="text-gray-600">
            Here's what's happening with your leads today.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* ✅ Navigate to Add Lead Page */}
          <button
            onClick={() => navigate("/add-lead")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <UserPlus size={18} />
            <span>Add New Lead</span>
          </button>

          {/* ✅ Logout */}
          {/* <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Logout
          </button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <StatCards />

      {/* Leads + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <RecentLeads />
        </div>
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
