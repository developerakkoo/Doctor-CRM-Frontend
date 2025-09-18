import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatCards from "../../components/Doctor/StatCards";
import RecentLeads from "../../components/Doctor/RecentLeads";
import QuickActions from "../../components/Doctor/QuickActions";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

// ✅ Fetch function
const fetchDoctorProfile = async (doctorId, token) => {
  const res = await fetch(`http://localhost:9191/api/v1/doctors/profile/${doctorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch doctor profile");
  return res.json();
};

const Dashboard = () => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("doctorId");
  const token = localStorage.getItem("doctorToken");

  if (!doctorId || !token) {
    navigate("/login");
    return null;
  }

  // ✅ React Query (v5 syntax)
  const { data, isLoading, error } = useQuery({
    queryKey: ["doctorProfile", doctorId],
    queryFn: () => fetchDoctorProfile(doctorId, token),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    onSuccess: (data) => {
      const name = data?.data?.name || "Doctor";
      toast.success(`Welcome back, ${name} 🎉`, { id: "login-success" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 font-semibold space-y-4">
        <p>{error.message}</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const doctorName = data?.data?.name || "Doctor";

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
          <button
            onClick={() => navigate("/add-lead")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <UserPlus size={18} />
            <span>Add New Lead</span>
          </button>
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
