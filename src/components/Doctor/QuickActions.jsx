import React from "react";
import { FaPlus, FaCalendarAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const QuickActions = () => (
  <div className="bg-white rounded-xl shadow p-6 mt-8">
    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
    <div className="flex flex-col space-y-3">
      <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-3 rounded">
        <FaPlus /><span>Add New Lead</span>
      </button>
      <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-3 rounded">
        <FaCalendarAlt /><span>Schedule Appointment</span>
      </button>
      <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-3 rounded">
        <FaEnvelope /><span>Send Follow-up Email</span>
      </button>
      <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-3 rounded">
        <FaPhone /><span>Make Call</span>
      </button>
    </div>
  </div>
);

export default QuickActions;
