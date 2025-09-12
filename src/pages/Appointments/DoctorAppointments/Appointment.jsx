import React, { useState, useEffect } from "react";
import axios from "axios";
import ScheduleAppointmentForm from "./ScheduleAppointmentForm";
import toast from "react-hot-toast";
import { Calendar, Clock, User, Phone, Mail, MapPin } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const Appointments = () => {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  

  const doctorToken = localStorage.getItem("doctorToken");


  

  // ✅ Common fetch function
const fetchAppointments = async () => {
  try {
    setLoading(true);

    const todayRes = await axios.get(
      "http://localhost:9191/api/v1/doctors/appointments/today",
      { headers: { Authorization: `Bearer ${doctorToken}` } }
    );
    const todays = todayRes.data.appointments || [];

    const upcomingRes = await axios.get(
      "http://localhost:9191/api/v1/doctors/upcoming-appointments",
      { headers: { Authorization: `Bearer ${doctorToken}` } }
    );
    const upcoming = upcomingRes.data.appointments || [];

    // 🔑 Merge without duplicates
    const merged = [...todays, ...upcoming].filter(
      (a, index, self) => index === self.findIndex((t) => t._id === a._id)
    );

    setAppointments(merged);
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to load appointments.";
    toast.error(errMsg);
  } finally {
    setLoading(false);
  }
};



const todaysAppointments = appointments.filter((a) =>
  dayjs(a.appointmentDate).isSame(dayjs(), "day")
);

const upcomingAppointments = appointments.filter((a) =>
  dayjs(a.appointmentDate).isAfter(dayjs(), "day")
);



  useEffect(() => {
    fetchAppointments();
  }, [doctorToken]);

  // ✅ Helper to render time safely
  const formatTime = (dateString) => {
    return dayjs(dateString).isValid()
      ? dayjs(dateString).format("HH:mm")
      : "Invalid Time";
  };

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
    return (
      <span className={`px-2 py-1 text-xs rounded ${typeConfig[type] || "bg-gray-200 text-gray-600"}`}>
        {type}
      </span>
    );
  };

  const sendEmailNotification = async (appointment) => {
    try {
      const doctorEmail = localStorage.getItem("doctorEmail");

      if (!appointment.email || !doctorEmail) {
        toast.error("❌ Missing patient or doctor email");
        return;
      }

      const response = await axios.post(
        "http://localhost:9191/api/v1/doctors/appointments/notify",
        {
          name: appointment.name,
          email: appointment.email,
          phone: appointment.phone,
          appointmentType: appointment.appointmentType,
          duration: appointment.duration,
          appointmentDate: dayjs(appointment.appointmentDate).format("YYYY-MM-DD"),
          appointmentTime: formatTime(appointment.appointmentDate),
          location: appointment.location,
          notes: appointment.notes || "No notes",
          patientEmail: appointment.email,
          doctorEmail,
        },
        { headers: { Authorization: `Bearer ${doctorToken}` } }
      );

      toast.success("Email sent successfully!");
      console.log("Notify API response:", response.data);
    } catch (error) {
      console.error("Error sending email:", error.response?.data || error);
      toast.error(" Failed to send email. Please try again.");
    }
  };

  const closeReschedulePopup = () => {
    setRescheduleId(null);
    setNewDate("");
    setNewTime("");
  };

  const handleRescheduleSubmit = async () => {
    if (!newDate || !newTime) {
      return toast.error("Please select a new date & time");
    }

    const newDateTime = dayjs(`${newDate}T${newTime}`).toISOString();

    try {
      await axios.patch(
        `http://localhost:9191/api/v1/doctors/appointments/edit/${rescheduleId}`,
        { appointmentDate: newDateTime },
        { headers: { Authorization: `Bearer ${doctorToken}` } }
      );
      toast.success("Appointment rescheduled successfully!");
      closeReschedulePopup();
      fetchAppointments(); // ✅ refresh both lists
    } catch (error) {
      console.error(error);
      toast.error("Failed to reschedule appointment");
    }
  };

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
          onSchedule={() => {
            setOpen(false);
            fetchAppointments(); // ✅ only refetch, no manual push
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
      {appointments.filter((a) => a.status === "confirmed").length}
    </div>
    <div className="text-sm text-gray-500">Confirmed</div>
  </div>
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-2xl font-bold text-yellow-600">
      {appointments.filter((a) => a.status === "scheduled").length}
    </div>
    <div className="text-sm text-gray-500">Pending</div>
  </div>
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-2xl font-bold text-gray-700">{upcomingAppointments.length}</div>
    <div className="text-sm text-gray-500">Upcoming Appointments</div>
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
                {formatTime(appointment.appointmentDate)}
              </div>
              {/* Patient Name */}
              <div className="flex items-center text-sm font-semibold text-gray-800">
                <User className="w-4 h-4 text-gray-500 mr-1" />
                {appointment.name}
              </div>
              {getTypeBadge(appointment.appointmentType?.toLowerCase() || "consultation")}
              {getStatusBadge(appointment.status?.toLowerCase())}
            </div>

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

          <div className="flex flex-col space-y-2 ml-4">
            <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
              Call
            </button>
            <button
              onClick={() => sendEmailNotification(appointment)}
              className="text-green-600 border border-green-600 px-3 py-1 rounded text-sm hover:bg-green-50"
            >
              Email
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

{/* Upcoming Appointments */}
<div className="bg-white shadow rounded p-4 mb-6">
  <h2 className="text-lg font-semibold flex items-center mb-4">
    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
    Upcoming Appointments
  </h2>

  {loading ? (
    <p className="text-gray-500">Loading upcoming appointments...</p>
  ) : upcomingAppointments.length === 0 ? (
    <p className="text-gray-500">No upcoming appointments.</p>
  ) : (
    <div className="space-y-4">
      {upcomingAppointments.map((appointment) => (
        <div
          key={appointment._id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition flex justify-between items-start relative"
        >
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <div className="flex items-center text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600 mr-1" />
                {dayjs(appointment.appointmentDate).format("YYYY-MM-DD")}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="w-4 h-4 text-blue-600 mr-1" />
                {formatTime(appointment.appointmentDate)}
              </div>
              <div className="flex items-center text-sm font-semibold text-gray-800">
                <User className="w-4 h-4 text-gray-500 mr-1" />
                {appointment.name}
              </div>
              {getTypeBadge(appointment.appointmentType?.toLowerCase() || "consultation")}
              {getStatusBadge(appointment.status?.toLowerCase())}
            </div>
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
          </div>

          <div className="flex flex-col space-y-2 ml-4 relative">
            <button
              className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50"
              onClick={() => setRescheduleId(appointment._id)}
            >
              Reschedule
            </button>
            <button
              onClick={() => sendEmailNotification(appointment)}
              className="text-green-600 border border-green-600 px-3 py-1 rounded text-sm hover:bg-green-50"
            >
              Email
            </button>

            {rescheduleId === appointment._id && (
              <div className="absolute right-full top-0 mr-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Reschedule Appointment</h3>
                  <label className="block text-xs font-medium mb-2">Select New Date & Time</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
                      onClick={closeReschedulePopup}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={handleRescheduleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
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
