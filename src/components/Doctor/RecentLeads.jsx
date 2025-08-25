import React, { useEffect, useState, useRef } from "react";
import { Mail, Phone, MoreHorizontal, Eye, Edit, PhoneCall } from "lucide-react";
import axios from "axios";

export default function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Keep a ref per row (keyed by index)
  const menuRefs = useRef({});

  useEffect(() => {
    const doctorToken = localStorage.getItem("doctorToken");
    const fetchRecentLeads = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9191/api/v1/doctors/recent-patients",
          { headers: { Authorization: `Bearer ${doctorToken}` } }
        );
        const data = Array.isArray(res.data?.recentPatients)
          ? res.data.recentPatients
          : [];
        setLeads(data);
      } catch (err) {
        console.error("Error fetching recent leads:", err);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentLeads();
  }, []);

  // ✅ Close only the currently open dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (openMenu === null) return;
      const container = menuRefs.current[openMenu];
      if (container && !container.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    // Use 'click' so it runs after onClick that opens the menu
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [openMenu]);

  // ✅ Fetch patient profile when clicking "View Details"
  const handleViewDetails = async (patientId) => {
    const doctorToken = localStorage.getItem("doctorToken");
    try {
      setProfileLoading(true);
      setOpenMenu(null); // close the menu when navigating to details
      const res = await axios.get(
        `http://localhost:9191/api/v1/doctors/patients/${patientId}`,
        { headers: { Authorization: `Bearer ${doctorToken}` } }
      );
      setSelectedPatient(res.data.data);
    } catch (err) {
      console.error("Error fetching patient profile:", err);
      setSelectedPatient(null);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : leads.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent leads found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="text-gray-500 font-medium">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Contact</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Priority</th>
                <th className="py-3 px-2">Source</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, idx) => (
                <tr key={lead.patientId || idx} className="border-t hover:bg-gray-50 transition-all">
                  <td className="py-4 px-2 font-semibold">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      {lead.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Phone size={14} className="text-gray-400" />
                      {lead.phone}
                    </div>
                  </td>
                  <td className="py-4 px-2">{lead.initialStatus || "N/A"}</td>
                  <td className="py-4 px-2">{lead.priority || "N/A"}</td>
                  <td className="py-4 px-2">{lead.source || "N/A"}</td>
                  <td className="py-4 px-2">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* The ref is on the entire action cell so clicks on icon or menu are "inside" */}
                  <td
                    className="py-4 px-2 relative"
                    ref={(el) => {
                      if (el) menuRefs.current[idx] = el;
                      else delete menuRefs.current[idx];
                    }}
                  >
                    <MoreHorizontal
                      size={18}
                      className="text-gray-900 cursor-pointer"
                      onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                    />

                    {openMenu === idx && (
                      <div
                        className="absolute right-8 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        // keep clicks inside from bubbling to the row if you have row click handlers
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="py-1 text-sm text-gray-700">
                          <li
                            className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer"
                            onClick={() => handleViewDetails(lead.patientId)}
                          >
                            <Eye size={14} /> View Details
                          </li>
                          {/* <li className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer">
                            <Edit size={14} /> Edit Lead
                          </li>
                          <li className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer">
                            <PhoneCall size={14} /> Call
                          </li>
                          <li className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer">
                            <Mail size={14} /> Email
                          </li> */}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (closes only via ✖) */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-white w-2/3 p-6 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setSelectedPatient(null)}
            >
              ✖
            </button>
            {profileLoading ? (
              <p className="text-gray-500">Loading profile...</p>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h2>
                <p><b>Patient ID:</b> {selectedPatient.patientId}</p>
                <p><b>Email:</b> {selectedPatient.email}</p>
                <p><b>Phone:</b> {selectedPatient.phone}</p>
                <p>
                  <b>DOB:</b>{" "}
                  {selectedPatient.dob
                    ? new Date(selectedPatient.dob).toLocaleDateString()
                    : "N/A"}
                </p>
                <p><b>Insurance:</b> {selectedPatient.insuranceProvider || "N/A"}</p>
                <p><b>Address:</b> {selectedPatient.address || "N/A"}</p>
                <p><b>Source:</b> {selectedPatient.source || "N/A"}</p>
                <p><b>Status:</b> {selectedPatient.initialStatus || "N/A"}</p>
                <p><b>Priority:</b> {selectedPatient.priority || "N/A"}</p>
                <p><b>Referred By:</b> {selectedPatient.referredBy || "N/A"}</p>
                <p><b>Notes:</b> {selectedPatient.initialNotes || "N/A"}</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
