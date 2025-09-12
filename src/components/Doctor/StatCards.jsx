import React, { useEffect, useState } from "react";
import { Users, UserPlus, CalendarDays, TrendingUp } from "lucide-react";
import axios from "axios";

const StatCards = () => {
  const [stats, setStats] = useState({
    total: 0,
    totalChange: 0,
    totalText: "",
    weekly: 0,
    weeklyChange: 0,
    weeklyText: "",
    appointments: 0,
    conversionRate: 0,
  });

  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Total Leads
        const totalRes = await axios.get(
          "http://localhost:9191/api/v1/doctors/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Weekly Leads (count only)
        const weekRes = await axios.get(
          "http://localhost:9191/api/v1/doctors/count/week",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Monthly change
        const monthRes = await axios.get(
          "http://localhost:9191/api/v1/doctors/patient-stats/months",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const monthData = monthRes.data?.data || {};
        const monthChange = monthData.percentageChange || 0;
        const monthText = monthData.text || "";

        // ✅ Weekly change
        const weekChangeRes = await axios.get(
          "http://localhost:9191/api/v1/doctors/patient-stats/weeks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const weeklyData = weekChangeRes.data?.data || {};
        const weeklyChange = weeklyData.percentageChange || 0;
        const weeklyText = weeklyData.text || "";

        // ✅ Appointments count
        const appointmentsRes = await axios.get(
          "http://localhost:9191/api/v1/doctors/appointments/count",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const appointments = appointmentsRes.data?.totalAppointments || 0;


        setStats({
          total: totalRes.data?.data?.total || 0,
          totalChange: monthChange.toFixed(2),
          totalText: monthText,
          weekly: weekRes.data?.count || 0,
          weeklyChange: weeklyChange.toFixed(2),
          weeklyText: weeklyText,
          appointments: appointments, // ✅ now dynamic
          conversionRate: 34, // connect API later
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [token]);

  const cards = [
    {
      title: "Total Leads",
      value: stats.total,
      change:
        stats.totalText ||
        `${stats.totalChange >= 0 ? "+" : ""}${stats.totalChange}% from last month`,
      icon: <Users className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "New This Week",
      value: stats.weekly,
      change:
        stats.weeklyText ||
        `${stats.weeklyChange >= 0 ? "+" : ""}${stats.weeklyChange}% vs last week`,
      icon: <UserPlus className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      change: "+8% scheduled",
      icon: <CalendarDays className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      change: "-2% this month",
      icon: <TrendingUp className="w-6 h-6 text-red-500" />,
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-black/40 rounded-xl p-6 transition-shadow duration-300 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.1),-3px_3px_10px_rgba(0,0,0,0.1)]"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.title}</p>
              <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
              <p
                className={`text-sm mt-1 ${
                  card.change.includes("-") ? "text-red-500" : "text-green-600"
                }`}
              >
                {card.change}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.bg}`}>{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
