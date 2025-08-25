import React, { useState } from "react";
import Sidebar from "../../components/Doctor/Sidebar";
import Navbar from "../../components/Doctor/Navbar";
import axios from "axios";
// import { toast } from "react-toastify";
import { toast } from "react-hot-toast";

import "react-toastify/dist/ReactToastify.css";


const AddLead = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    insuranceProvider: "",
    address: "",
    source: "",
    priority: "",
    initialStatus: "",
    referredBy: "",
    initialNotes: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


 // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit
   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("doctorToken");
      console.log("Submitting formData:", formData);

      const res = await axios.post(
        "http://localhost:9191/api/patient/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Success toast
      toast.success(res.data.message || "Lead added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      handleReset();
    } catch (err) {
      console.error("API Error:", err.response?.data);

      // ✅ Show backend error if available
      const errorMsg =
        err.response?.data?.message || "Failed to save lead! Please try again.";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset form
  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      insuranceProvider: "",
      address: "",
      source: "",
      priority: "",
      initialStatus: "",
      referredBy: "",
      initialNotes: "",
      password: "",
    });
  };




  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16  overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Add New Lead</h1>
              <p className="text-gray-500">
                Add a new potential patient to your lead database
              </p>
            </div>
            <button className="flex items-center px-4 py-2 text-sm bg-gray-100 rounded-lg">
              <span className="mr-2">👤</span> New Lead
            </button>
          </div>

          {message && (
            <div
              className={`mb-4 p-2 rounded ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-black">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-black">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm text-black">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-black">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm text-black">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-black">Insurance Provider</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    placeholder="Enter insurance provider"
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <label className="block text-sm text-black">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows="2"
                  className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Lead Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Lead Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Lead Source */}
                <div>
                  <label className="block text-sm text-black">Lead Source *</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-black-100 focus:outline-none"
                    style={{ backgroundColor: "white" }}
                    onFocus={(e) => {
                      e.target.size = 3;
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.borderRadius = "0.5rem";
                      e.target.style.overflowY = "auto";
                    }}
                    onBlur={(e) => {
                      e.target.size = 0;
                      e.target.style.backgroundColor = "white";
                    }}
                  >
                    <option value="">Select source</option>
                    <option>website</option>
                    <option>referral</option>
                    <option>google ads</option>
                    <option>walk-in</option>
                    <option>phone call</option>
                    <option>email</option>
                    <option>social media</option>
                    <option>other</option>
                  </select>
                </div>

                {/* Priority Level */}
                <div>
                  <label className="block text-sm text-black">Priority Level *</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-black-100 focus:outline-none"
                    style={{ backgroundColor: "white" }}
                    onFocus={(e) => {
                      e.target.size = 3;
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.borderRadius = "0.5rem";
                      e.target.style.overflowY = "auto";
                    }}
                    onBlur={(e) => {
                      e.target.size = 0;
                      e.target.style.backgroundColor = "white";
                    }}
                  >
                    <option value="">Select priority</option>
                    <option>high</option>
                    <option>medium</option>
                    <option>low</option>
                  </select>
                </div>

                {/* Initial Status */}
                <div>
                  <label className="block text-sm text-black">Initial Status</label>
                  <select
                    name="initialStatus"
                    value={formData.initialStatus}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-black-100 focus:outline-none"
                    style={{ backgroundColor: "white" }}
                    onFocus={(e) => {
                      e.target.size = 3;
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.borderRadius = "0.5rem";
                      e.target.style.overflowY = "auto";
                    }}
                    onBlur={(e) => {
                      e.target.size = 0;
                      e.target.style.backgroundColor = "white";
                    }}
                  >
                    <option value="">New</option>
                    <option>contact</option>
                    <option>qualified</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-black">Referred By</label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  placeholder="Name of person who referred this lead"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm text-black">Initial Notes</label>
                <textarea
                  name="initialNotes"
                  value={formData.initialNotes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Add any initial notes about this lead..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm text-black">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Set a password for patient login"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  ✕ Reset Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {loading ? "Saving..." : "💾 Save Lead"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddLead;
