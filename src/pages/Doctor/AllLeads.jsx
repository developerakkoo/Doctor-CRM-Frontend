import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import {
  FiFilter,
  FiSearch,
  FiUserPlus,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import Sidebar from "../../components/Doctor/Sidebar";
import Navbar from "../../components/Doctor/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
  });
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [noPatientsMessage, setNoPatientsMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

  const token = localStorage.getItem("doctorToken");
  const navigate = useNavigate();
  // const dropdownRef = useRef(null);

  const dropdownRefs = useRef({});

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && dropdownRefs.current[openMenuId]) {
        if (!dropdownRefs.current[openMenuId].contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);


  // ✅ Fetch Patients
  const fetchPatients = async (query = "") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:9191/api/patient/filter?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setLeads(res.data.data || []);
        if (res.data.data.length === 0) {
          setNoPatientsMessage("No patients found.");
        }
      } else {
        setNoPatientsMessage("Failed to fetch patients.");
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setNoPatientsMessage("Error fetching patients.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9191/api/v1/doctors/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setCounts(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchStats();
  }, []);

  const handleSearch = () => {
    fetchPatients(searchTerm);
  };

  // ✅ Fetch patient profile when clicking "View Details"
  const handleViewDetails = async (patientId) => {
    const doctorToken = localStorage.getItem("doctorToken");
    try {
      setDetailsLoading(true);  // ✅ use detailsLoading
      setOpenMenuId(null);      // ✅ close menu (it was setOpenMenu, typo earlier)
      const res = await axios.get(
        `http://localhost:9191/api/v1/doctors/patients/${patientId}`,
        { headers: { Authorization: `Bearer ${doctorToken}` } }
      );
      setSelectedPatient(res.data.data);
      setShowModal(true); // ✅ open modal when details are fetched
    } catch (err) {
      console.error("Error fetching patient profile:", err);
      setSelectedPatient(null);
      setShowModal(true); // ✅ still open modal to show "No details available."
    } finally {
      setDetailsLoading(false);
    }
  };

// 🟢 Handle Edit Lead
// 🟢 Handle Edit Lead
const handleEditLead = async (patientId) => {
  try {
    setDetailsLoading(true);
    setShowModal(true);
    setIsEditing(true); // ✅ editing mode

    // ⬇️ Get token (assuming you stored it in localStorage)
    const token = localStorage.getItem("doctorToken");

    const res = await axios.get(
      `http://localhost:9191/api/v1/doctors/patients/${patientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach token
        },
      }
    );

    setSelectedPatient(res.data.data); // ✅ data inside .data.data
    setFormData(res.data.data);        // ✅ fill form
  } catch (error) {
    console.error("Error fetching patient details for edit:", error);
  } finally {
    setDetailsLoading(false);
  }
};


// 🟢 Handle Update API
const handleUpdate = async () => {
  try {
    setDetailsLoading(true);

    const token = localStorage.getItem("doctorToken");

    // API call to update patient
    await axios.put(
      `http://localhost:9191/api/v1/doctors/patients/update/${formData.patientId}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update local state so modal shows new data instantly
    setSelectedPatient({ ...selectedPatient, ...formData });

    // Keep modal open and exit edit mode
    setIsEditing(false);

    // Show success toast
    toast.success("Patient updated successfully ✅");
  } catch (error) {
    console.error("Error updating patient:", error);
    toast.error("Update failed ❌");
  } finally {
    setDetailsLoading(false);
  }
};






  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mt-8 pt-2 mb-6">
            <div>
              <h1 className="text-2xl font-bold">All Leads</h1>
              <p className="text-gray-600">
                Manage and track all your registered patients
              </p>
            </div>
            <button
              onClick={() => navigate("/add-lead")}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              <FiUserPlus className="mr-2" /> Add New Patient
            </button>
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex items-center space-x-3 mb-3 p-2">
              <FiFilter className="text-blue-500" />
              <h2 className="font-semibold">Filters & Search</h2>
            </div>
            <div className="flex gap-3 pb-4">
              <div className="relative flex-1 flex">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients by name, email, or phone..."
                  className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleSearch() : null
                  }
                />
              </div>
              <button
                onClick={handleSearch}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
              { label: "Total Patients", value: counts.total },
              { label: "New", value: counts.new, color: "text-yellow-500" },
              {
                label: "Contacted",
                value: counts.contacted,
                color: "text-blue-500",
              },
              {
                label: "Qualified",
                value: counts.qualified,
                color: "text-green-500",
              },
              {
                label: "Converted",
                value: counts.converted,
                color: "text-green-600",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow text-center"
              >
                <p className={`text-2xl font-bold ${item.color || ""}`}>
                  {item.value}
                </p>
                <p className="text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-lg shadow overflow-visible relative">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((patient) => (
                    <tr
                      key={patient._id}
                      className="border-t hover:bg-gray-50 relative"
                    >
                      <td className="px-6 py-3 font-semibold">
                        {patient.firstName} {patient.lastName}
                        <div className="text-sm text-gray-500">
                          {patient.initialNotes || "No notes"}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        <div>{patient.email}</div>
                        <div>{patient.phone}</div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                          {patient.initialStatus || "New"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${patient.priority?.toLowerCase() === "high"
                            ? "bg-red-100 text-red-600"
                            : patient.priority?.toLowerCase() === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                            }`}
                        >
                          {patient.priority || "Low"}
                        </span>
                      </td>
                      <td className="px-6 py-3">{patient.source || "N/A"}</td>
                      <td className="px-6 py-3">
                        {patient.createdAt
                          ? new Date(patient.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td
                        className="py-4 px-2 relative"
                        ref={(el) => {
                          if (el) dropdownRefs.current[patient._id] = el;
                          else delete dropdownRefs.current[patient._id];
                        }}
                      >
                        <FiMoreVertical
                          size={18}
                          className="text-gray-900 cursor-pointer"
                          onClick={() =>
                            setOpenMenuId(openMenuId === patient._id ? null : patient._id)
                          }
                        />

                        {openMenuId === patient._id && (
                          <div
                            className="absolute right-8 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                            onClick={(e) => e.stopPropagation()} // prevent bubbling
                          >
                            <ul className="py-1 text-sm text-gray-700">
                              <li
                                className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer"
                                onClick={() => handleViewDetails(patient.patientId)}
                              >
                                <FiEye size={14} /> View Details
                              </li>
                              <li className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer" 
                                onClick={() => handleEditLead(patient.patientId)}
                              >
                                <FiEdit2 size={14} /> Edit Lead
                              </li>
                              <li className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer">
                                <FiPhone size={14} /> Call
                              </li>
                              <li className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer">
                                <FiMail size={14} /> Email
                              </li>
                            </ul>
                          </div>
                        )}
                      </td>



                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {noPatientsMessage || "No patients found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Patient Details Modal with Blur Background */}
      {/* ✅ Patient Details/Edit Modal with Blur Background */}
{/* 🟢 Patient Details / Edit Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-2/3 p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative">
      
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-black"
        onClick={() => {
          setShowModal(false);
          setIsEditing(false);
        }}
      >
        ✖
      </button>

      {detailsLoading ? (
        <p className="text-gray-500">Loading patient details...</p>
      ) : selectedPatient ? (
        <div className="space-y-4">
          {/* Modal Header */}
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "✏️ Edit Patient" : "👤 Patient Details"} 
            
          </h2>
          <p><b>Patient ID:</b> {selectedPatient.patientId}</p>
          {/* Patient Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-gray-600">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              ) : (
                <p className="font-semibold">{selectedPatient.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-600">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              ) : (
                <p className="font-semibold">{selectedPatient.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              ) : (
                <p className="font-semibold">{selectedPatient.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-600">Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              ) : (
                <p className="font-semibold">{selectedPatient.phone}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-gray-600">DOB</label>
              {isEditing ? (
                <input
                  type="date"
                  value={
                    formData.dob
                      ? new Date(formData.dob).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              ) : (
                <p className="font-semibold">
                  {selectedPatient.dob
                    ? new Date(selectedPatient.dob).toLocaleDateString()
                    : "N/A"}
                </p>
              )}
            </div>

            {/* Insurance */}
            <div>
              <label className="block text-gray-600">Insurance</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.insuranceProvider || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, insuranceProvider: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              ) : (
                <p className="font-semibold">{selectedPatient.insuranceProvider || "N/A"}</p>
              )}
            </div>

            {/* Source */}
            <div>
              <label className="block text-gray-600">Source</label>
              <p className="font-semibold">{selectedPatient.source || "N/A"}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-600">Status</label>
              <p className="font-semibold">{selectedPatient.initialStatus || "N/A"}</p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-gray-600">Priority</label>
              <p className="font-semibold">{selectedPatient.priority || "N/A"}</p>
            </div>

            {/* Referred By */}
            <div>
              <label className="block text-gray-600">Referred By</label>
              <p className="font-semibold">{selectedPatient.referredBy || "N/A"}</p>
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-gray-600">Notes</label>
              {isEditing ? (
                <textarea
                  value={formData.initialNotes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, initialNotes: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              ) : (
                <p className="font-semibold">{selectedPatient.initialNotes || "N/A"}</p>
              )}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block text-gray-600">Address</label>
              {isEditing ? (
                <textarea
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              ) : (
                <p className="font-semibold">{selectedPatient.address || "N/A"}</p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                {/* Edit */}
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center py-10">No details available.</p>
      )}
    </div>
  </div>
)}



    </div>
  );
};

export default AllLeads;
