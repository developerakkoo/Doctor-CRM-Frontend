import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import DashboardLayout from "../../layouts/PatientDashboardLayout";

const appointmentTypes = ["Consultation", "Follow-up", "Check-up", "Emergency"];
const departments = ["General", "Cardiology", "Dermatology", "Orthopedics"];
const doctors = {
  General: ["Dr. John Smith", "Dr. Sarah Johnson"],
  Cardiology: ["Dr. Michael Brown", "Dr. Emily Davis"],
  Dermatology: ["Dr. Lisa Wilson"],
  Orthopedics: ["Dr. Robert Taylor"],
};
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const priorityLevels = ["Routine", "Urgent", "Emergency"];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    appointmentType: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    reason: "",
    priority: "Routine",
  });
  const [errors, setErrors] = useState({});

  // simple form validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.appointmentType) newErrors.appointmentType = "Please select type";
    if (!formData.department) newErrors.department = "Please select department";
    if (!formData.doctor) newErrors.doctor = "Please select doctor";
    if (!formData.date) newErrors.date = "Please pick a date";
    if (!formData.time) newErrors.time = "Please pick a time";
    if (formData.reason.length < 10) newErrors.reason = "Reason must be at least 10 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    alert(
      `✅ Appointment booked!\n\nType: ${formData.appointmentType}\nDoctor: ${formData.doctor}\nDate: ${formData.date}\nTime: ${formData.time}`
    );
    navigate("/patient-dashboard");
  };

  const availableDoctors = formData.department ? doctors[formData.department] || [] : [];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-bold">Book Appointment</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Appointment Type */}
            <div>
              <label className="block text-sm text-black mb-1 font-medium">
                Appointment Type
              </label>
              <select
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.appointmentType && (
                <p className="text-red-500 text-sm mt-1">{errors.appointmentType}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm text-black mb-1 font-medium">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
              )}
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-sm text-black mb-1 font-medium">
                Doctor
              </label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select doctor</option>
                {availableDoctors.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
              {errors.doctor && (
                <p className="text-red-500 text-sm mt-1">{errors.doctor}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm text-black mb-1 font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm text-black mb-1 font-medium">Time</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm text-black mb-1 font-medium">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorityLevels.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm text-black mb-1 font-medium">
                Reason
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Describe your reason..."
              />
              {errors.reason && (
                <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Calendar className="h-4 w-4" /> Book
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow space-y-3">
              <h2 className="text-lg font-semibold">Info</h2>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Arrive 15 min early</li>
                <li>• Bring ID & insurance</li>
                <li>• Carry medical records</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
