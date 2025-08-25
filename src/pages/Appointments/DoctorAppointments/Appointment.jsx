import React, { useState, useEffect } from "react";
import axios from "axios";
import ScheduleAppointmentForm from "./ScheduleAppointmentForm";
import toast from "react-hot-toast";
import { Calendar, Clock, User, Phone, Mail, MapPin } from "lucide-react";

const Appointments = () => {
  const [open, setOpen] = useState(false);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");

  const doctorToken = localStorage.getItem("doctorToken");

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { label: "Scheduled", className: "bg-yellow-100 text-yellow-700" },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
      completed: { label: "Completed", className: "bg-green-100 text-green-700" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
      "no-show": { label: "No Show", className: "bg-gray-200 text-gray-600" },
    };
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700" };
    return <span className={`px-2 py-1 text-xs rounded ${config.className}`}>{config.label}</span>;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      consultation: "bg-gray-100 text-gray-700",
      "follow-up": "bg-purple-100 text-purple-700",
      treatment: "bg-green-100 text-green-700",
      emergency: "bg-red-100 text-red-700",
    };
    return <span className={`px-2 py-1 text-xs rounded ${typeConfig[type] || "bg-gray-200 text-gray-600"}`}>{type}</span>;
  };

  // Fetch today's appointments from API
  useEffect(() => {
    const fetchTodaysAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:9191/api/v1/doctors/appointments/today",
          { headers: { Authorization: `Bearer ${doctorToken}` } }
        );
        const appts = response.data.appointments || [];
        setTodaysAppointments(appts);
        setAppointments(appts);
      } catch (error) {
        const errMsg = error.response?.data?.message || "Failed to load today's appointments.";
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysAppointments();
  }, [doctorToken]);

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) > new Date()
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your patient appointments and schedule</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Schedule Appointment
        </button>
      </div>

      {/* Schedule Form */}
      {open && (
        <ScheduleAppointmentForm
          isOpen={open}
          onClose={() => setOpen(false)}
          onSchedule={(apt) => {
            setAppointments([...appointments, apt]);
            const today = new Date().toISOString().split("T")[0];
            if (apt.appointmentDate === today) {
              setTodaysAppointments([...todaysAppointments, apt]);
            }
            setOpen(false);
          }}
        />
      )}




      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{todaysAppointments.length}</div>
          <div className="text-sm text-gray-500">Today's Appointments</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {appointments.filter(a => a.status === "confirmed").length}
          </div>
          <div className="text-sm text-gray-500">Confirmed</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === "scheduled").length}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-gray-700">
            {appointments.filter(a => new Date(a.appointmentDate) > new Date()).length}
          </div>
          <div className="text-sm text-gray-500">Upcoming Appointments</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-48"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Appointments</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-48"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>


    

      {/* Today's Appointments */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold flex items-center mb-4">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          Today's Schedule
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : todaysAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments for today.</p>
        ) : (
          <div className="space-y-4">
            {todaysAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    {/* Time */}
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-blue-600 mr-1" />
                      {appointment.appointmentTime}
                    </div>
                    {/* Patient Name */}
                    <div className="flex items-center text-sm font-semibold text-gray-800">
                      <User className="w-4 h-4 text-gray-500 mr-1" />
                      {appointment.name}
                    </div>
                    {/* Type & Status Badges */}
                    {getTypeBadge(appointment.appointmentType)}
                    {/* {getStatusBadge(appointment.status)} */}
                  </div>

                  {/* Contact & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {appointment.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {appointment.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {appointment.location}
                    </div>
                  </div>

                  {appointment.notes && (
                    <p className="text-sm text-gray-500 mt-2 italic">{appointment.notes}</p>
                  )}
                </div>

                {/* Call & Email Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                    Call
                  </button>
                  <button className="text-green-600 border border-green-600 px-3 py-1 rounded text-sm hover:bg-green-50">
                    Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Upcoming Appointments */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment._id || appointment.id} className="border rounded p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium">
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                      </span>
                      <span className="font-semibold">{appointment.name || appointment.patientName}</span>
                      {getTypeBadge(appointment.appointmentType || appointment.type)}
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div>{appointment.phone}</div>
                      <div>{appointment.email}</div>
                      <div>{appointment.location}</div>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">{appointment.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
