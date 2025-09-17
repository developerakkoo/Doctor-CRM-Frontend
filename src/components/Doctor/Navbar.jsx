import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiUser, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../../assets/defaultProfile.png";
import toast from "react-hot-toast";

const Navbar = ({ toggleSidebar }) => {
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
  const [showDropdown, setShowDropdown] = useState(false);
  const searchBoxRef = useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:9191/api/patient/filter?search=${encodeURIComponent(
          value
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      const results = Array.isArray(data.data) ? data.data : [];
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } catch (err) {
      console.error("Search error:", err.message);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveView(null);
      }
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const res = await fetch(
        `http://localhost:9191/api/v1/doctors/profile/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setDoctorProfile(data.data);
      setFormData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:9191/api/v1/doctors/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout API error:", err);
    }
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-300 fixed top-0 left-0 sm:left-64 right-0 z-20">
      {/* Hamburger for Mobile */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden text-gray-600 hover:text-blue-600"
      >
        <FiMenu size={22} />
      </button>

      {/* Search */}
      <div ref={searchBoxRef} className="flex-1 mx-2 sm:mx-8 max-w-lg relative">
        <div className="flex items-center bg-gray-100 rounded-md px-3 sm:px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <FiSearch className="text-gray-500 mr-2" size={16} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={handleSearch}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
            {searchResults.map((patient) => (
              <div
                key={patient._id}
                onClick={() => {
                  setSelectedPatient(patient);
                  setSearchResults([]);
                }}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {patient.firstName} –{" "}
                <span className="text-gray-500">{patient.email}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6 relative" ref={dropdownRef}>
        <div className="relative">
          <FiBell
            className="text-gray-600 hover:text-blue-600 cursor-pointer"
            size={18}
          />
          <span className="absolute top-[-4px] right-[-6px] w-2.5 h-2.5 bg-red-500 rounded-full" />
        </div>

        <FiUser
          className="text-gray-600 hover:text-blue-600 cursor-pointer"
          size={20}
          onClick={() => {
            if (!isOpen) fetchDoctorProfile();
            setIsOpen(!isOpen);
          }}
        />

        {isOpen && (
          <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg border border-black/20 p-4 z-50">
            {/* Default Menu */}
            {!activeView && (
              <>
                <button
                  onClick={() => setActiveView("profile")}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded font-medium"
                >
                  👤 Doctor Profile
                </button>
                <button
                  onClick={() => setActiveView("changePassword")}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded font-medium"
                >
                  🔒 Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500 rounded font-medium"
                >
                  🚪 Logout
                </button>
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
                    <p className="text-xs text-gray-500">
                      {doctorProfile.specialty}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">📧 {doctorProfile.email}</p>
                <p className="text-sm text-gray-600">
                  🩺 {doctorProfile.yearsOfExperience} years exp.
                </p>
                <p className="text-sm text-gray-600">📞 {doctorProfile.phone}</p>

                <button
                  onClick={() => setActiveView("updateProfile")}
                  className="mt-3 w-full bg-green-500 text-white py-1 rounded text-sm hover:bg-green-600"
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
              <form onSubmit={updateDoctorProfile}>
                <h3 className="text-lg font-semibold mb-3">Update Profile</h3>
                {["name", "email", "age", "yearsOfExperience", "phone"].map(
                  (field) => (
                    <input
                      key={field}
                      type={
                        field === "age" || field === "yearsOfExperience"
                          ? "number"
                          : "text"
                      }
                      placeholder={field}
                      value={formData[field] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded mb-2 text-sm"
                    />
                  )
                )}
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
                    className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Change Password */}
            {activeView === "changePassword" && (
              <form onSubmit={changePassword}>
                <h3 className="text-lg font-semibold mb-3">Change Password</h3>
                <input
                  type="password"
                  placeholder="Old Password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded mb-2 text-sm"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded mb-2 text-sm"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded mb-3 text-sm"
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
                    className="bg-yellow-500 text-white px-4 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
