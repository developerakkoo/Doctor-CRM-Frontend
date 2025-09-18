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
  BarChart,
  Bar,
} from "recharts";
import { Users, Calendar, TrendingUp, BarChart2 } from "lucide-react";

const Analytics = () => {
  // ---------------- STATES ----------------
  const [stats, setStats] = useState({
    total: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
  });

  const [statsChange, setStatsChange] = useState({
    total: 12,
    contacted: -5,
    qualified: 18,
    converted: 10,
  });

  const [leadTrendsData, setLeadTrendsData] = useState([]);
  const [leadSourcesData, setLeadSourcesData] = useState([]);
  const [appointmentsTrend, setAppointmentsTrend] = useState([]);
  const [appointmentsStatus, setAppointmentsStatus] = useState([]);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("doctorToken");

        // ---- CACHE ----
        const cacheKey = "analyticsCache";
        const cacheExpiryKey = "analyticsCacheExpiry";
        const now = Date.now();
        const cached = localStorage.getItem(cacheKey);
        const cachedExpiry = localStorage.getItem(cacheExpiryKey);

        if (cached && cachedExpiry && now < parseInt(cachedExpiry)) {
          const { stats, trends, sources, apptTrend, apptStatus } = JSON.parse(cached);
          setStats(stats);
          setLeadTrendsData(trends);
          setLeadSourcesData(sources);
          setAppointmentsTrend(apptTrend);
          setAppointmentsStatus(apptStatus);
          return;
        }

        // ---- FETCH STATS ----
        const statsRes = await fetch("http://localhost:9191/api/v1/doctors/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        // ---- FETCH PATIENTS ----
        const patientsRes = await fetch("http://localhost:9191/api/v1/doctors/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const patientsData = await patientsRes.json();
        const patients = patientsData.patients || [];

        // ---- Lead Trends ----
        const months = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec",
        ];
        const trends = Array(12).fill(0).map((_, i) => ({ month: months[i], leads: 0, converted: 0 }));
        patients.forEach((p) => {
          const date = new Date(p.createdAt);
          const monthIndex = date.getMonth();
          trends[monthIndex].leads += 1;
          if (p.initialStatus === "converted") trends[monthIndex].converted += 1;
        });

        setLeadTrendsData(trends);

        // ---- Lead Sources ----
        const sourceCounts = {};
        patients.forEach((p) => {
          const source = p.source || "Unknown";
          sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });
        const colors = ["#0ea5e9", "#22c55e", "#facc15", "#ef4444", "#6b7280", "#a855f7", "#f97316"];
        const sources = Object.entries(sourceCounts).map(([name, value], idx) => ({
          name, value, color: colors[idx % colors.length],
        }));
        setLeadSourcesData(sources);

        // ---- Daily Appointments Trend ----
        const last7Days = Array(7).fill(0).map((_, i) => {
          const day = new Date();
          day.setDate(day.getDate() - (6 - i));
          return { date: day.toISOString().slice(0,10), appointments: 0 };
        });
        // Sample logic for appointments trend
        last7Days.forEach(d => {
          patients.forEach(p => {
            const pDate = p.appointmentDate?.slice(0,10);
            if(pDate === d.date) d.appointments += 1;
          });
        });
        setAppointmentsTrend(last7Days);

        // ---- Appointments Status ----
        const statusData = ["scheduled","confirmed","completed","cancelled","no-show"].map(s => {
          const count = patients.filter(p => p.status === s).length;
          return { status: s.charAt(0).toUpperCase() + s.slice(1), count: count };
        });
        setAppointmentsStatus(statusData);

        // ---- SAVE CACHE ----
        const expiryTime = now + 5*60*1000;
        localStorage.setItem(cacheKey, JSON.stringify({
          stats: statsData.data,
          trends,
          sources,
          apptTrend: last7Days,
          apptStatus: statusData,
        }));
        localStorage.setItem(cacheExpiryKey, expiryTime.toString());

      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen space-y-8">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-500 text-sm md:text-base">
          Overview of leads, appointments, and performance
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Leads", value: stats.total, change: statsChange.total, icon: Users, color: "text-blue-600" },
          { label: "Contacted", value: stats.contacted, change: statsChange.contacted, icon: Calendar, color: "text-green-600" },
          { label: "Qualified", value: stats.qualified, change: statsChange.qualified, icon: TrendingUp, color: "text-yellow-600" },
          { label: "Converted", value: stats.converted, change: statsChange.converted, icon: BarChart2, color: "text-purple-600" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition-shadow relative"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">{card.label}</p>
              <card.icon className={`h-8 w-8 ${card.color}`} />
            </div>
            <p className="text-3xl font-extrabold text-gray-800">{card.value}</p>
            <span
              className={`mt-2 text-xs font-medium px-2 py-1 rounded-full ${
                card.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
              title={`Change vs last month: ${card.change}%`}
            >
              {card.change >= 0 ? `+${card.change}% ↑` : `${card.change}% ↓`}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Lead Trends */}
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
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
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
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

        {/* Appointments Trend */}
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Appointments Trend (Last 7 Days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Status */}
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-purple-600" />
            Appointments Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentsStatus} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="status" />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
