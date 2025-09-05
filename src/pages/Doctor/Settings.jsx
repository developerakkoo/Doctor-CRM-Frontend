import React, { useState, useEffect } from "react";
import { User, Settings as SettingsIcon } from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const doctorId = localStorage.getItem("doctorId");
  const token = localStorage.getItem("doctorToken");

  const [profileSettings, setProfileSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "Dr.",
    specialty: "",
    license: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch doctor profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!doctorId || !token) {
        toast.error("Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:9191/api/v1/doctors/profile/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          const doctor = data.data;
          const nameParts = (doctor.name || "").split(" ");
          setProfileSettings({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: doctor.email || "",
            phone: doctor.phone || "",
            title: doctor.title || "Dr.",
            specialty: doctor.specialty || "",
            license: doctor.licenseNumber || "",
            bio: doctor.professionalBio || "",
          });
        } else {
          toast.error(data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [doctorId, token]);

  // ✅ Save profile
  const handleSaveProfile = async () => {
    if (!doctorId || !token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        `http://localhost:9191/api/v1/doctors/update/${doctorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: `${profileSettings.firstName} ${profileSettings.lastName}`,
            email: profileSettings.email,
            phone: profileSettings.phone,
            title: profileSettings.title,
            specialty: profileSettings.specialty,
            licenseNumber: profileSettings.license,
            professionalBio: profileSettings.bio,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account and application preferences
          </p>
        </div>
        <SettingsIcon className="h-8 w-8 text-blue-600" />
      </div>

      {/* Profile Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Profile Information</h2>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={profileSettings.firstName}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={profileSettings.lastName}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, lastName: e.target.value })
              }
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={profileSettings.email}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={profileSettings.phone}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* Title, Specialty, License */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <select
              className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={profileSettings.title}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, title: e.target.value })
              }
            >
              <option>Dr.</option>
              <option>Mr.</option>
              <option>Ms.</option>
              <option>Mrs.</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Specialty
            </label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={profileSettings.specialty}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, specialty: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              License Number
            </label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={profileSettings.license}
              onChange={(e) =>
                setProfileSettings({ ...profileSettings, license: e.target.value })
              }
            />
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Professional Bio
          </label>
          <textarea
            className="mt-1 w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={profileSettings.bio}
            onChange={(e) =>
              setProfileSettings({ ...profileSettings, bio: e.target.value })
            }
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
