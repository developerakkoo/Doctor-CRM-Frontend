import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../../assets/defaultProfile.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const doctorId = localStorage.getItem("doctorId");
  const token = localStorage.getItem("doctorToken");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

 // 🔍 Search States
const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [selectedPatient, setSelectedPatient] = useState(null);
const [showDropdown, setShowDropdown] = useState(false); // ✅ add this
const searchBoxRef = useRef(null);
  

const handleSearch = async (e) => {
  const value = e.target.value;
  setSearchQuery(value);

  if (value.trim() === "") {
    setSearchResults([]);
    setShowDropdown(false); // ✅ close when empty
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:9191/api/patient/filter?search=${encodeURIComponent(value)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Search failed: ${res.status}`);
    }

    const data = await res.json();
    const results = Array.isArray(data.data) ? data.data : [];
    setSearchResults(results);
    setShowDropdown(results.length > 0); // ✅ open if we have results
  } catch (err) {
    console.error("Search error:", err.message);
    setSearchResults([]);
    setShowDropdown(false);
  }
};








  // Close dropdown on outside click
  useEffect(() => {

     const handleClickOutside = (event) => {
    // Sidebar / profile dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setActiveView(null);
    }

    // Search dropdown
    if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  // 🔹 When clicking on a lead in dropdown
  const handleSelectLead = (lead) => {
    console.log("Lead clicked:", lead);

    setShowDropdown(false); // ✅ close dropdown
    setSearchQuery("");     // optional: clear search input

    
  };



  // Fetch doctor profile
  const fetchDoctorProfile = async () => {
    try {
      const res = await fetch(
        `http://localhost:9191/api/v1/doctors/profile/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setDoctorProfile(data.data);
      setFormData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle profile update
  const updateDoctorProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:9191/api/v1/doctors/update/${doctorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to update profile");
      const updatedData = await res.json();
      setDoctorProfile(updatedData.data);
      setActiveView("profile");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle change password
  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:9191/api/v1/doctors/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to change password");
      alert("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setActiveView(null);
    } catch (err) {
      console.error(err);
      alert("Error changing password");
    }
  };


  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:9191/api/v1/doctors/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout API error:", err);
    }

    // ✅ Clear all session data
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorId");
    localStorage.clear(); // clears everything if you store other stuff

    // ✅ Show toast
    toast.success("Logged out successfully!");

    // ✅ Redirect to login (your DoctorAuth page is at "/")
    navigate("/");
  };


  return (
    <div className="flex items-center justify-between px-6 py-3 pb-5 bg-white border-b border-gray-300 fixed top-0 left-64 right-0 z-10">
      {/* Search bar */}
      <div ref={searchBoxRef} className="flex-1 mx-8 max-w-lg relative">
  <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
    <FiSearch className="text-gray-500 mr-2" size={16} />
    <input
      type="text"
      placeholder="Search patients..."
      value={searchQuery}
      onChange={handleSearch}
      className="bg-transparent outline-none w-full text-sm"
    />
  </div>

  {/* 🔎 Dropdown results */}
  {searchResults.length > 0 && (
    <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
      {searchResults.map((patient) => (
        <div
          key={patient._id}
          onClick={() => {
            setSelectedPatient(patient);
            setSearchResults([]);   // ✅ close dropdown when selecting
          }}
          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
        >
          {patient.firstName} – <span className="text-gray-500">{patient.email}</span>
        </div>
      ))}
    </div>
  )}
</div>

      {/* Patient Info Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-white w-2/3 p-6 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setSelectedPatient(null)}
              >
                ✖
              </button>
            </div>

            {/* Patient Details */}
            <p><strong>Patient ID:</strong> {selectedPatient.patientId}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>DOB:</strong> {selectedPatient.dob}</p>
            <p><strong>Insurance:</strong> {selectedPatient.insuranceProvider}</p>
            <p><strong>Address:</strong> {selectedPatient.address}</p>
            <p><strong>Source:</strong> {selectedPatient.source}</p>
            <p><strong>Status:</strong> {selectedPatient.initialStatus}</p>
            <p><strong>Priority:</strong> {selectedPatient.priority}</p>
            <p><strong>Referred By:</strong> {selectedPatient.referredBy}</p>
            <p><strong>Notes:</strong> {selectedPatient.initialNotes}</p>
          </div>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center space-x-9 relative" ref={dropdownRef}>
        {/* Notification Bell */}
        <div className="relative">
          <FiBell className="text-gray-600 hover:text-blue-600 cursor-pointer" size={18} />
          <span className="absolute top-[-4px] right-[-6px] w-2.5 h-2.5 bg-red-500 rounded-full" />
        </div>

        {/* User Icon */}
        <div className="relative">
          <FiUser
            className="text-gray-600 hover:text-blue-600 cursor-pointer"
            size={20}
            onClick={() => {
              if (!isOpen) fetchDoctorProfile();
              setIsOpen(!isOpen);
            }}
          />

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg border  border-black/40 p-4 z-50">
              {/* Menu */}
              {!activeView && (
                <>
                  <button
                    onClick={() => setActiveView("profile")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded font-medium"
                  >
                    👤 Doctor Profile
                  </button>
                  <hr className=" border-gray-400" />
                  <button
                    onClick={() => setActiveView("changePassword")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-200 rounded font-medium"
                  >
                    🔒 Change Password
                  </button>
                  <hr className=" border-gray-400" />

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500 rounded font-medium"
                  >
                    🚪 Logout
                  </button>
                  <hr className=" border-gray-400" />
                </>
              )}

              {/* Profile View */}
              {activeView === "profile" && doctorProfile && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Doctor Profile</h3>
                  <div className="flex items-center mb-3">
                    <img
                      src={doctorProfile.image || defaultProfile}
                      alt="Doctor"
                      className="w-14 h-14 rounded-full mr-3 border object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{doctorProfile.name}</p>
                      <p className="text-xs text-gray-500">{doctorProfile.specialty}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">📧 {doctorProfile.email}</p>
                  <p className="text-sm text-gray-600">🎂 Age: {doctorProfile.age}</p>
                  <p className="text-sm text-gray-600">
                    📍 {doctorProfile.location?.locationName}
                  </p>
                  <p className="text-sm text-gray-600">
                    🩺 Experience: {doctorProfile.yearsOfExperience} years
                  </p>
                  <p className="text-sm text-gray-600">📞 {doctorProfile.phone}</p>

                  <button
                    onClick={() => setActiveView("updateProfile")}
                    className="mt-3 w-full bg-green-400 text-white py-1 rounded text-sm hover:bg-green-500"
                  >
                    ✏️ Update Profile
                  </button>
                  <button
                    onClick={() => setActiveView(null)}
                    className="mt-3 text-sm text-blue-500 hover:underline block text-center"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Update Profile Form */}
              {activeView === "updateProfile" && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Update Profile</h3>
                  <form onSubmit={updateDoctorProfile}>
                    {["name", "email", "age", "yearsOfExperience", "phone"].map((field) => (
                      <input
                        key={field}
                        type={field === "age" || field === "yearsOfExperience" ? "number" : "text"}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData[field] || ""}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full border px-3 py-2 rounded mb-2 text-sm focus:outline-none focus:ring focus:ring-yellow-300"
                      />
                    ))}
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveView("profile")}
                        className="text-sm text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-green-400 text-white px-4 py-1 rounded text-sm hover:bg-green-500"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Change Password Form */}
              {activeView === "changePassword" && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Change Password</h3>
                  <form onSubmit={changePassword}>
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, oldPassword: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded mb-2 text-sm focus:outline-none focus:ring focus:ring-yellow-300"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded mb-2 text-sm focus:outline-none focus:ring focus:ring-yellow-300"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded mb-3 text-sm focus:outline-none focus:ring focus:ring-yellow-300"
                    />
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveView(null)}
                        className="text-sm text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-yellow-400 text-white px-4 py-1 rounded text-sm hover:bg-yellow-500"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
