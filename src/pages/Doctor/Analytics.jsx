import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Users, Calendar, TrendingUp, BarChart2 } from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
  });

  const [leadTrendsData, setLeadTrendsData] = useState([]);
  const [leadSourcesData, setLeadSourcesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("doctorToken");

        // Fetch stats
        const statsRes = await fetch("http://localhost:9191/api/v1/doctors/stats", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        // Fetch patients
        const patientsRes = await fetch("http://localhost:9191/api/v1/doctors/patients", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const patientsData = await patientsRes.json();
        const patients = patientsData.patients;

        // --- Lead Trends (month-wise aggregation) ---
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const trends = Array(12).fill(0).map((_, i) => ({
          month: months[i],
          leads: 0,
          converted: 0,
        }));

        patients.forEach((p) => {
          const date = new Date(p.createdAt);
          const monthIndex = date.getMonth();
          trends[monthIndex].leads += 1;
          if (p.initialStatus === "converted") trends[monthIndex].converted += 1;
        });

        setLeadTrendsData(trends);

        // --- Lead Sources (source-wise aggregation) ---
        const sourceCounts = {};
        patients.forEach((p) => {
          const source = p.source || "Unknown";
          sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });

        const colors = ["#0ea5e9", "#22c55e", "#facc15", "#ef4444", "#6b7280", "#a855f7", "#f97316"];
        const sources = Object.entries(sourceCounts).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length],
        }));

        setLeadSourcesData(sources);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-9">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        {/* <div>
          <select className="border rounded px-3 py-2 text-gray-700">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div> */}
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Leads</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Contacted</p>
            <p className="text-2xl font-bold">{stats.contacted}</p>
          </div>
          <Calendar className="h-8 w-8 text-green-600" />
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Qualified</p>
            <p className="text-2xl font-bold">{stats.qualified}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-yellow-600" />
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Converted</p>
            <p className="text-2xl font-bold">{stats.converted}</p>
          </div>
          <BarChart2 className="h-8 w-8 text-purple-600" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Trends */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Lead Trends
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="converted" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Lead Sources
          </h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSourcesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {leadSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
