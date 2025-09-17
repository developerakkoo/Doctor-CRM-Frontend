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


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 7;

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center  mb-6 gap-4">
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



      {/* Stats */}
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



      {/* Filters & Search */}
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









      {/* Patients Table / Mobile Cards */}
      <div className="bg-white rounded-lg shadow relative">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Priority</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : currentLeads.length > 0 ? (
                currentLeads.map((patient) => (
                  <tr key={patient._id} className="border-t hover:bg-gray-50 text-sm">
                    <td className="px-3 py-2 font-semibold whitespace-nowrap">
                      {patient.firstName} {patient.lastName}
                      <div className="text-xs text-gray-500 truncate max-w-[120px]">
                        {patient.initialNotes || "No notes"}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                      <div className="truncate max-w-[140px]">{patient.email}</div>
                      <div className="text-xs">{patient.phone}</div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                        {patient.initialStatus || "New"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${patient.priority?.toLowerCase() === "high"
                            ? "bg-red-100 text-red-600"
                            : patient.priority?.toLowerCase() === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                      >
                        {patient.priority || "Low"}
                      </span>
                    </td>
                    <td className="px-3 py-2">{patient.source || "N/A"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {patient.createdAt
                        ? new Date(patient.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleViewDetails(patient.patientId)}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditLead(patient.patientId)}
                        className="text-green-500 hover:underline"
                      >
                        Edit
                      </button>
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

        {/* Mobile Cards */}
        <div className="block md:hidden divide-y">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : currentLeads.length > 0 ? (
            currentLeads.map((patient) => (
              <div key={patient._id} className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    {patient.initialStatus || "New"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{patient.email}</p>
                <p className="text-sm text-gray-600">{patient.phone}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${patient.priority?.toLowerCase() === "high"
                        ? "bg-red-100 text-red-600"
                        : patient.priority?.toLowerCase() === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                  >
                    {patient.priority || "Low"}
                  </span>
                  <span className="text-gray-500">
                    {patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex gap-4 mt-3 text-blue-500 text-sm">
                  <button onClick={() => handleViewDetails(patient.patientId)}>
                    View
                  </button>
                  <button onClick={() => handleEditLead(patient.patientId)}>
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4">
              {noPatientsMessage || "No patients found."}
            </p>
          )}
        </div>

        {/* Pagination Controls (shared for both views) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 flex-wrap">
            {/* Prev */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {/* Page Numbers with Ellipsis */}
            {(() => {
              const pages = [];
              const maxVisible = 5; // how many numbers to show around current
              const start = Math.max(1, currentPage - 2);
              const end = Math.min(totalPages, currentPage + 2);

              if (start > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => goToPage(1)}
                    className={`px-3 py-1 rounded ${currentPage === 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    1
                  </button>
                );
                if (start > 2) {
                  pages.push(
                    <span key="start-ellipsis" className="px-2">
                      …
                    </span>
                  );
                }
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 rounded ${currentPage === i
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {i}
                  </button>
                );
              }

              if (end < totalPages) {
                if (end < totalPages - 1) {
                  pages.push(
                    <span key="end-ellipsis" className="px-2">
                      …
                    </span>
                  );
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => goToPage(totalPages)}
                    className={`px-3 py-1 rounded ${currentPage === totalPages
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}

            {/* Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}


      </div>






      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-2">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setSelectedPatient(null);
              }}
            >
              ✖
            </button>

            {detailsLoading ? (
              <p className="text-gray-500">Loading details...</p>
            ) : selectedPatient ? (
              isEditing ? (
                // ✅ Edit Mode with ALL fields
                <div>
                  <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="border rounded-lg p-2 w-full"
                      value={formData.firstName || ""}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="border rounded-lg p-2 w-full"
                      value={formData.lastName || ""}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="border rounded-lg p-2 w-full"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      className="border rounded-lg p-2 w-full"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                      type="date"
                      className="border rounded-lg p-2 w-full"
                      value={formData.dob ? formData.dob.split("T")[0] : ""}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Insurance Provider"
                      className="border rounded-lg p-2 w-full"
                      value={formData.insuranceProvider || ""}
                      onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      className="border rounded-lg p-2 w-full"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Source"
                      className="border rounded-lg p-2 w-full"
                      value={formData.source || ""}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Status"
                      className="border rounded-lg p-2 w-full"
                      value={formData.initialStatus || ""}
                      onChange={(e) => setFormData({ ...formData, initialStatus: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Priority"
                      className="border rounded-lg p-2 w-full"
                      value={formData.priority || ""}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Referred By"
                      className="border rounded-lg p-2 w-full"
                      value={formData.referredBy || ""}
                      onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                    />
                    <textarea
                      placeholder="Notes"
                      className="border rounded-lg p-2 w-full col-span-2"
                      rows={3}
                      value={formData.initialNotes || ""}
                      onChange={(e) => setFormData({ ...formData, initialNotes: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // ✅ View Mode
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <p><b>Patient ID:</b> {selectedPatient.patientId}</p>
                  <p><b>Email:</b> {selectedPatient.email}</p>
                  <p><b>Phone:</b> {selectedPatient.phone}</p>
                  <p><b>DOB:</b> {selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString() : "N/A"}</p>
                  <p><b>Insurance:</b> {selectedPatient.insuranceProvider || "N/A"}</p>
                  <p><b>Address:</b> {selectedPatient.address || "N/A"}</p>
                  <p><b>Source:</b> {selectedPatient.source || "N/A"}</p>
                  <p><b>Status:</b> {selectedPatient.initialStatus || "N/A"}</p>
                  <p><b>Priority:</b> {selectedPatient.priority || "N/A"}</p>
                  <p><b>Referred By:</b> {selectedPatient.referredBy || "N/A"}</p>
                  <p><b>Notes:</b> {selectedPatient.initialNotes || "N/A"}</p>
                </div>
              )
            ) : (
              <p className="text-gray-500">No patient data available</p>
            )}
          </div>
        </div>
      )}

    </div>
  );

};

export default AllLeads;
