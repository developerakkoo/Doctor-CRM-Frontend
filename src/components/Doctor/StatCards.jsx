import React from "react";
import { Users, UserPlus, CalendarDays, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Fetch stats function
const fetchStats = async (token) => {
  const headers = { Authorization: `Bearer ${token}` };

  const [totalRes, weekRes, monthRes, weekChangeRes, appointmentsRes] =
    await Promise.all([
      axios.get("http://localhost:9191/api/v1/doctors/stats", { headers }),
      axios.get("http://localhost:9191/api/v1/doctors/count/week", { headers }),
      axios.get("http://localhost:9191/api/v1/doctors/patient-stats/months", { headers }),
      axios.get("http://localhost:9191/api/v1/doctors/patient-stats/weeks", { headers }),
      axios.get("http://localhost:9191/api/v1/doctors/appointments/count", { headers }),
    ]);

  const monthData = monthRes.data?.data || {};
  const weekData = weekChangeRes.data?.data || {};

  return {
    total: totalRes.data?.data?.total || 0,
    totalChange: parseFloat(monthData.percentageChange || 0),
    totalText: monthData.text || "",

    weekly: weekRes.data?.count || 0,
    weeklyChange: parseFloat(weekData.percentageChange || 0),
    weeklyText: weekData.text || "",

    appointments: appointmentsRes.data?.totalAppointments || 0,
    appointmentsChange: 12,
    appointmentsText: "vs last month",
    conversionRate: 42,
    conversionText: "-1.5% this month",
  };
};

const StatCards = () => {
  const token = localStorage.getItem("doctorToken");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["doctorStats", token],
    queryFn: () => fetchStats(token),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!token,
    onError: () => toast.error("Failed to load statistics ❌"),
  });

  // Dummy sparkline data (replace with real API trends)
  const sparklineData = {
    total: Array(7).fill(0).map(() => Math.floor(Math.random() * 20 + 5)),
    weekly: Array(7).fill(0).map(() => Math.floor(Math.random() * 15 + 5)),
    appointments: Array(7).fill(0).map(() => Math.floor(Math.random() * 10 + 2)),
    conversionRate: Array(7).fill(0).map(() => Math.floor(Math.random() * 8 + 1)),
  };

  const getSparkColor = (data) =>
    data[data.length - 1] >= data[0] ? "#10b981" : "#ef4444";

  const cards = stats
    ? [
        {
          title: "Total Leads",
          value: stats.total,
          change: stats.totalChange,
          changeText:
            stats.totalText ||
            `${stats.totalChange >= 0 ? "+" : ""}${stats.totalChange}% from last month`,
          icon: <Users className="w-6 h-6 text-white" />,
          bgGradient: "bg-gradient-to-r from-green-400 to-green-600",
          spark: sparklineData.total,
        },
        {
          title: "New This Week",
          value: stats.weekly,
          change: stats.weeklyChange,
          changeText:
            stats.weeklyText ||
            `${stats.weeklyChange >= 0 ? "+" : ""}${stats.weeklyChange}% vs last week`,
          icon: <UserPlus className="w-6 h-6 text-white" />,
          bgGradient: "bg-gradient-to-r from-blue-400 to-blue-600",
          spark: sparklineData.weekly,
        },
        {
          title: "Appointments",
          value: stats.appointments,
          change: stats.appointmentsChange,
          changeText: `${stats.appointmentsChange >= 0 ? "+" : ""}${stats.appointmentsChange}% ${stats.appointmentsText}`,
          icon: <CalendarDays className="w-6 h-6 text-white" />,
          bgGradient: "bg-gradient-to-r from-purple-400 to-purple-600",
          spark: sparklineData.appointments,
        },
        {
          title: "Conversion Rate",
          value: `${stats.conversionRate}%`,
          change: parseFloat(stats.conversionText) || 0,
          changeText: stats.conversionText,
          icon: <TrendingUp className="w-6 h-6 text-white" />,
          bgGradient: "bg-gradient-to-r from-red-400 to-red-600",
          spark: sparklineData.conversionRate,
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {isLoading
        ? Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-12 mt-3 bg-gray-100 rounded"></div>
              </div>
            ))
        : cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-2xl font-bold">{card.value}</h2>
                    {/* Trend Arrow */}
                    {card.change !== 0 && (
                      <span
                        className={`${
                          card.change > 0 ? "text-green-600" : "text-red-500"
                        } text-lg font-semibold`}
                      >
                        {card.change > 0 ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      card.change < 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {card.changeText}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgGradient} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>

              {/* Sparkline with Tooltip */}
              <div className="mt-3 h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={card.spark.map((v, i) => ({ day: `D${i + 1}`, value: v }))}>
                    <XAxis dataKey="day" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ fontSize: "12px", borderRadius: "6px", padding: "6px" }}
                      formatter={(value) => [`${value}`, "Value"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={getSparkColor(card.spark)}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
    </div>
  );
};

export default StatCards;
