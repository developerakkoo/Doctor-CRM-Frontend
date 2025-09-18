import React, { useEffect, useState, useRef } from "react";
import { Mail, Phone, MoreHorizontal, Eye } from "lucide-react";
import axios from "axios";
import ReactDOM from "react-dom";

const CACHE_KEY = "recentLeadsCache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const RecentLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const menuRefs = useRef({});

  useEffect(() => {
    const doctorToken = localStorage.getItem("doctorToken");

    const fetchRecentLeads = async () => {
      try {
        const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
        const now = Date.now();
        if (cachedData.timestamp && now - cachedData.timestamp < CACHE_DURATION) {
          setLeads(cachedData.leads || []);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:9191/api/v1/doctors/recent-patients",
          { headers: { Authorization: `Bearer ${doctorToken}` } }
        );
        const data = Array.isArray(res.data?.recentPatients) ? res.data.recentPatients : [];
        setLeads(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ leads: data, timestamp: now }));
      } catch (err) {
        console.error("Error fetching recent leads:", err);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLeads();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (openMenu === null) return;
      const container = menuRefs.current[openMenu];
      if (container && !container.contains(event.target)) setOpenMenu(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [openMenu]);

  const handleViewDetails = async (patientId) => {
    const doctorToken = localStorage.getItem("doctorToken");
    try {
      setProfileLoading(true);
      setOpenMenu(null);
      const res = await axios.get(
        `http://localhost:9191/api/v1/doctors/patients/${patientId}`,
        { headers: { Authorization: `Bearer ${doctorToken}` } }
      );
      setSelectedPatient(res.data?.data || null);
    } catch (err) {
      console.error("Error fetching patient profile:", err);
      setSelectedPatient(null);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-8 transform transition-all hover:-translate-y-1 hover:shadow-2xl">
      {/* Top accent line with matching rounded corners */}
      <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-blue-500 via-green-400 to-yellow-400 mb-4"></div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-6 mt-2">Recent Leads</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : leads.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent leads found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-gray-700">
            <thead className="bg-gray-50">
              <tr className="text-gray-500 uppercase text-xs tracking-wider">
                <th className="py-3 px-3 rounded-tl-xl">Name</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead, idx) => (
                <tr key={lead.patientId || idx} className="hover:bg-gray-50 transition-all">
                  <td className="py-4 px-3 font-medium text-gray-800">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} /> {lead.email || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Phone size={14} /> {lead.phone || "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-gray-700">{lead.initialStatus || "N/A"}</td>
                  <td className="py-4 px-3 text-gray-700">{lead.priority || "N/A"}</td>
                  <td className="py-4 px-3 text-gray-700">{lead.source || "N/A"}</td>
                  <td className="py-4 px-3 text-gray-700">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td
                    className="py-4 px-3 relative"
                    ref={(el) => {
                      if (el) menuRefs.current[idx] = el;
                      else delete menuRefs.current[idx];
                    }}
                  >
                    <MoreHorizontal
                      size={18}
                      className="text-gray-800 cursor-pointer"
                      onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                    />
                    {openMenu === idx && (
                      <div
                        className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="py-1 text-sm text-gray-700">
                          <li
                            className="px-4 py-2 hover:bg-green-100 flex items-center gap-2 cursor-pointer"
                            onClick={() => handleViewDetails(lead.patientId)}
                          >
                            <Eye size={14} /> View Details
                          </li>
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

      {/* Modal */}
      {selectedPatient &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
            <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
                onClick={() => setSelectedPatient(null)}
              >
                ✖
              </button>
              {profileLoading ? (
                <p className="text-gray-500">Loading profile...</p>
              ) : (
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {selectedPatient?.firstName} {selectedPatient?.lastName}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                    <p><b>Patient ID:</b> {selectedPatient?.patientId || "N/A"}</p>
                    <p><b>Email:</b> {selectedPatient?.email || "N/A"}</p>
                    <p><b>Phone:</b> {selectedPatient?.phone || "N/A"}</p>
                    <p><b>DOB:</b> {selectedPatient?.dob ? new Date(selectedPatient.dob).toLocaleDateString() : "N/A"}</p>
                    <p><b>Insurance:</b> {selectedPatient?.insuranceProvider || "N/A"}</p>
                    <p><b>Address:</b> {selectedPatient?.address || "N/A"}</p>
                    <p><b>Source:</b> {selectedPatient?.source || "N/A"}</p>
                    <p><b>Status:</b> {selectedPatient?.initialStatus || "N/A"}</p>
                    <p><b>Priority:</b> {selectedPatient?.priority || "N/A"}</p>
                    <p><b>Referred By:</b> {selectedPatient?.referredBy || "N/A"}</p>
                    <p className="col-span-2"><b>Notes:</b> {selectedPatient?.initialNotes || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default RecentLeads;
