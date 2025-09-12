import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
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
  const dropdownRefs = useRef({});

  // ✅ Close dropdown on outside click
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
          headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
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

  // ✅ View Patient
  const handleViewDetails = async (patientId) => {
    try {
      setDetailsLoading(true);
      setOpenMenuId(null);
      const res = await axios.get(
        `http://localhost:9191/api/v1/doctors/patients/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPatient(res.data.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching patient profile:", err);
      setSelectedPatient(null);
      setShowModal(true);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ✅ Edit Lead
  const handleEditLead = async (patientId) => {
    try {
      setDetailsLoading(true);
      setShowModal(true);
      setIsEditing(true);

      const res = await axios.get(
        `http://localhost:9191/api/v1/doctors/patients/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedPatient(res.data.data);
      setFormData(res.data.data);
    } catch (error) {
      console.error("Error fetching patient details for edit:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ✅ Update Patient
  const handleUpdate = async () => {
    try {
      setDetailsLoading(true);
      await axios.put(
        `http://localhost:9191/api/v1/doctors/patients/update/${formData.patientId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPatient({ ...selectedPatient, ...formData });
      setIsEditing(false);
      toast.success("Patient updated successfully ✅");
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Update failed ❌");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 flex-1">
      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Leads</h1>
          <p className="text-gray-600">Manage and track all your registered patients</p>
        </div>
        <button
          onClick={() => navigate("/add-lead")}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 w-full sm:w-auto justify-center"
        >
          <FiUserPlus className="mr-2" /> Add New Patient
        </button>
      </div>

      {/* ✅ Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center space-x-3 mb-3 p-2">
          <FiFilter className="text-blue-500" />
          <h2 className="font-semibold">Filters & Search</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <div className="relative flex-1 flex">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </div>

      {/* ✅ Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Patients", value: counts.total },
          { label: "New", value: counts.new, color: "text-yellow-500" },
          { label: "Contacted", value: counts.contacted, color: "text-blue-500" },
          { label: "Qualified", value: counts.qualified, color: "text-green-500" },
          { label: "Converted", value: counts.converted, color: "text-green-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow text-center">
            <p className={`text-2xl font-bold ${item.color || ""}`}>{item.value}</p>
            <p className="text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* ✅ Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto relative">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3 hidden sm:table-cell">Source</th>
              <th className="px-4 py-3 hidden sm:table-cell">Date</th>
              <th className="px-4 py-3">Action</th>
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
                <tr key={patient._id} className="border-t hover:bg-gray-50 relative">
                  <td className="px-4 py-3 font-semibold">
                    {patient.firstName} {patient.lastName}
                    <div className="text-sm text-gray-500 truncate max-w-[150px] sm:max-w-full">
                      {patient.initialNotes || "No notes"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="truncate max-w-[120px] sm:max-w-full">{patient.email}</div>
                    <div>{patient.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                      {patient.initialStatus || "New"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        patient.priority?.toLowerCase() === "high"
                          ? "bg-red-100 text-red-600"
                          : patient.priority?.toLowerCase() === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {patient.priority || "Low"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {patient.source || "N/A"}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4 px-2 relative">
                    <FiMoreVertical
                      size={18}
                      className="text-gray-900 cursor-pointer"
                      onClick={() =>
                        setOpenMenuId(openMenuId === patient._id ? null : patient._id)
                      }
                    />
                    {openMenuId === patient._id && (
                      <div
                        className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="py-1 text-sm text-gray-700">
                          <li
                            className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer"
                            onClick={() => handleViewDetails(patient.patientId)}
                          >
                            <FiEye size={14} /> View Details
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer"
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

{showModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-2">
    <div className="bg-white w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative">
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
        <p className="text-center py-6">Loading...</p>
      ) : selectedPatient ? (
        isEditing ? (
          /* ✅ Edit Form */
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Edit: {formData.firstName} {formData.lastName}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <input
                type="email"
                className="border p-2 rounded"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="tel"
                className="border p-2 rounded"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Insurance"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
              />
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <select
                className="border p-2 rounded"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="contact">Contact</option>
                <option value="converted">Converted</option>
              </select>
              <select
                className="border p-2 rounded"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Referred By"
                value={formData.referredBy}
                onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
              />
              <textarea
                className="border p-2 rounded col-span-2"
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* ✅ Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          /* ✅ Details View */
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <div className="space-y-2">
              <p><strong>Patient ID:</strong> {selectedPatient.patientId}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p><strong>DOB:</strong> {selectedPatient.dob}</p>
              <p><strong>Insurance:</strong> {selectedPatient.insurance}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Source:</strong> {selectedPatient.source}</p>
              <p><strong>Status:</strong> {selectedPatient.status}</p>
              <p><strong>Priority:</strong> {selectedPatient.priority}</p>
              <p><strong>Referred By:</strong> {selectedPatient.referredBy}</p>
              <p><strong>Notes:</strong> {selectedPatient.notes}</p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  firstName: selectedPatient.firstName,
                  lastName: selectedPatient.lastName,
                  email: selectedPatient.email,
                  phone: selectedPatient.phone,
                  dob: selectedPatient.dob,
                  insurance: selectedPatient.insurance,
                  address: selectedPatient.address,
                  source: selectedPatient.source,
                  status: selectedPatient.status,
                  priority: selectedPatient.priority,
                  referredBy: selectedPatient.referredBy,
                  notes: selectedPatient.notes,
                });
                setIsEditing(true);
              }}
              // className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600
                   >
             
            </button>
          </div>
        )
      ) : (
        <p className="text-center py-6">No patient details found.</p>
      )}
    </div>
  </div>
)}


    </div>
  );
};

export default AllLeads;
