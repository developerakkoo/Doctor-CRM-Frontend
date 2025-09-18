import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaCalendarAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const QuickActions = () => (
  <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-8 transform transition-all hover:-translate-y-1 hover:shadow-2xl">
    {/* Top accent line */}
    <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-blue-500 via-green-400 to-yellow-400 mb-4"></div>

    <h3 className="text-2xl font-semibold text-gray-900 mb-6 mt-2">Quick Actions</h3>

    <div className="grid sm:grid-cols-2 gap-4">
      <Link to="/add-lead" className="w-full">
        <button className="w-full h-full flex items-center justify-center space-x-3 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-lg transition transform hover:scale-105 p-4 rounded-xl text-gray-900 font-medium">
          <FaPlus className="text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
          <span>Add New Lead</span>
        </button>
      </Link>

      <Link to="/appointments" className="w-full">
        <button className="w-full h-full flex items-center justify-center space-x-3 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-lg transition transform hover:scale-105 p-4 rounded-xl text-gray-900 font-medium">
          <FaCalendarAlt className="text-green-500 transition-transform duration-300 group-hover:translate-x-1" />
          <span>Schedule Appointment</span>
        </button>
      </Link>

      <Link to="/appointments" className="w-full">
        <button className="w-full h-full flex items-center justify-center space-x-3 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-lg transition transform hover:scale-105 p-4 rounded-xl text-gray-900 font-medium">
          <FaEnvelope className="text-yellow-500 transition-transform duration-300 group-hover:translate-x-1" />
          <span>Send Follow-up Email</span>
        </button>
      </Link>

      <Link to="/appointments" className="w-full">
        <button className="w-full h-full flex items-center justify-center space-x-3 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-lg transition transform hover:scale-105 p-4 rounded-xl text-gray-900 font-medium">
          <FaPhone className="text-red-500 transition-transform duration-300 group-hover:translate-x-1" />
          <span>Make Call</span>
        </button>
      </Link>
    </div>
  </div>
);

export default QuickActions;
