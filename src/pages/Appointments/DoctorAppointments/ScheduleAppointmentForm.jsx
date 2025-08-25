import React, { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";

const ScheduleAppointmentForm = ({ isOpen, onClose, onSchedule }) => {
  const [date, setDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]); // ✅ store patient list
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    email: "",
    phone: "",
    type: "",
    time: "",
    duration: "60",
    location: "",
    notes: "",
  });

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  // ✅ Fetch all patients when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      const doctorToken = localStorage.getItem("doctorToken");
      const response = await axios.get("http://localhost:9191/api/v1/doctors/patients", {
        headers: {
          Authorization: `Bearer ${doctorToken}`,
        },
      });

      // ✅ Extract patients array
      const data = response.data?.patients || [];
      setPatients(data);
      console.log("Fetched patients:", data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
    }
  };


  // ✅ Handle patient selection and auto-fill
  const handlePatientSelect = (e) => {
    const selectedId = e.target.value;
    const selectedPatient = patients.find((p) => p._id === selectedId);

    if (selectedPatient) {
      setFormData({
        ...formData,
        patientId: selectedPatient._id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        email: selectedPatient.email || "",
        phone: selectedPatient.phone || "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doctorToken = localStorage.getItem("doctorToken");
    if (!doctorToken) {
      alert("Authentication token missing. Please log in.");
      return;
    }

    const appointmentData = {
      name: formData.patientName,
      email: formData.email,
      phone: formData.phone,
      appointmentType: formData.type,
      duration: `${formData.duration} minutes`,
      appointmentDate: date ? date.toISOString().split("T")[0] : null,
      appointmentTime: formData.time,
      location: formData.location,
      notes: formData.notes,
    };

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:9191/api/v1/doctors/appointments/create",
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );

      toast.success("Appointment Created Successfully!");

      if (onSchedule) onSchedule(response.data);

      setFormData({
        patientId: "",
        patientName: "",
        email: "",
        phone: "",
        type: "",
        time: "",
        duration: "60",
        location: "",
        notes: "",
      });
      setDate(null);
      onClose();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        "Something went wrong while creating the appointment.";
      toast.error(` ${backendMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Schedule New Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Patient Information</h3>

            {/* ✅ Dropdown for patient selection */}
            {/* <select
              value={formData.patientId}
              onChange={handlePatientSelect}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Patient *</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select> */}

            <select onChange={handlePatientSelect} value={formData.patientId}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient Name *"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <input
              type="tel"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Appointment Type *</option>
                <option value="Consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="Treatment">Treatment</option>
                <option value="emergency">Emergency</option>
              </select>

              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full border rounded px-3 py-2 text-left flex items-center"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date ? format(date, "PPP") : "Pick a date *"}
              </button>
              {showCalendar && (
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => setDate(new Date(e.target.value))}
                  required
                />
              )}

              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select time *</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={3}
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !formData.patientName ||
                !formData.email ||
                !formData.phone ||
                !formData.type ||
                !date ||
                !formData.time
              }
              className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} disabled:opacity-50`}
            >
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleAppointmentForm;
