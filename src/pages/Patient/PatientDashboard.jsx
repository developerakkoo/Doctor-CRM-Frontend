import React from "react";
import {
  Calendar,
  Phone,
  Pill,
  FileText,
  Mail,
  MapPin,
  AlertCircle,
  PersonStanding
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../../layouts/PatientDashboardLayout";



// ✅ Dummy data 
const healthMetrics = [
  
  { title: "Blood Pressure", value: "120/80", unit: "mmHg", status: "Normal", lastUpdated: "1h ago", icon: Calendar },
  { title: "Blood Sugar", value: "92", unit: "mg/dL", status: "Good", lastUpdated: "2h ago", icon: Calendar },
  { title: "Weight", value: "72", unit: "kg", status: "Stable", lastUpdated: "Today", icon: Calendar },
  { title: "Height", value: "178", unit: "cm", status: "Good", lastUpdated: "5m ago", icon: PersonStanding },
];

const upcomingAppointments = [
  { id: 1, type: "Dental Checkup", doctor: "Dr. Smith", department: "Dentistry", date: "Aug 25", time: "10:30 AM", status: "Confirmed" },
  { id: 2, type: "Eye Exam", doctor: "Dr. Lee", department: "Ophthalmology", date: "Aug 27", time: "2:00 PM", status: "Pending" },
];

const medications = [
  { name: "Aspirin", dosage: "75mg", frequency: "Once daily", remaining: 15, total: 30, nextRefill: "Sep 1" },
  { name: "Metformin", dosage: "500mg", frequency: "Twice daily", remaining: 10, total: 60, nextRefill: "Sep 10" },
];

const recentResults = [
  { test: "Blood Test", doctor: "Dr. Johnson", date: "Aug 18", status: "Normal" },
  { test: "X-Ray", doctor: "Dr. Brown", date: "Aug 12", status: "Review" },
];

// ✅ Badge color logic
const getStatusColor = (status) => {
  switch (status) {
    case "Normal":
    case "Confirmed":
    case "Good":
    case "Stable":
      return "bg-green-100 text-green-700";
    case "Pending":
    case "Review":
      return "bg-yellow-100 text-yellow-700";
    case "Critical":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const PatientDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 pl-10">
        {/* Welcome Section */}
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, John</h1>
            <p className="text-gray-500 mt-1">
              Here's your health overview for today.
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </button>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl shadow bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{metric.title}</h3>
                <metric.icon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold">
                {metric.value}{" "}
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
                <p className="text-xs text-gray-400">{metric.lastUpdated}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 p-6 rounded-xl shadow bg-white">
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{appointment.type}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {appointment.doctor} • {appointment.department}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-sm">
                          <span className="font-medium">{appointment.date}</span>
                          <span className="text-gray-500">{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100 flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> Call
                      </button>
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No upcoming appointments.
                </p>
              )}
            </div>
            <button className="w-full mt-4 border rounded-lg py-2 hover:bg-gray-50">
              View All Appointments
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Medications */}
            <div className="p-6 rounded-xl shadow bg-white">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <Pill className="h-5 w-5 mr-2 text-blue-600" />
                Medications
              </h2>
              {medications.map((med, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{med.name}</h4>
                    <span className="text-xs text-gray-500">{med.dosage}</span>
                  </div>
                  <p className="text-sm text-gray-500">{med.frequency}</p>
                  <div className="mt-1">
                    <div className="flex justify-between text-xs">
                      <span>Pills remaining</span>
                      <span>{med.remaining}/{med.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="h-2 bg-blue-500 rounded"
                        style={{ width: `${(med.remaining / med.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Next refill: {med.nextRefill}
                  </p>
                </div>
              ))}
              <button className="w-full border rounded-lg py-2 hover:bg-gray-50">
                Request Refill
              </button>
            </div>

            {/* Recent Lab Results */}
            <div className="p-6 rounded-xl shadow bg-white">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Recent Results
              </h2>
              {recentResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                  <div>
                    <p className="font-medium text-sm">{result.test}</p>
                    <p className="text-xs text-gray-500">{result.doctor}</p>
                    <p className="text-xs text-gray-500">{result.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>
              ))}
              <button className="w-full border rounded-lg py-2 hover:bg-gray-50">
                View All Results
              </button>
            </div>

            {/* Quick Contact */}
            <div className="p-6 rounded-xl shadow bg-white">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Quick Contact
              </h2>
              <div className="space-y-2">
                <button className="w-full flex items-center px-3 py-2 border rounded hover:bg-gray-50">
                  <Phone className="h-4 w-4 mr-2" /> Call Main Office
                </button>
                <button className="w-full flex items-center px-3 py-2 border rounded hover:bg-gray-50">
                  <Mail className="h-4 w-4 mr-2" /> Message Doctor
                </button>
                <button className="w-full flex items-center px-3 py-2 border rounded hover:bg-gray-50">
                  <MapPin className="h-4 w-4 mr-2" /> Get Directions
                </button>
                <button className="w-full flex items-center px-3 py-2 border rounded hover:bg-gray-50">
                  <AlertCircle className="h-4 w-4 mr-2" /> Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
