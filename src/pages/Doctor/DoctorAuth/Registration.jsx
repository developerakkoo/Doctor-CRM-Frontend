import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar"; 

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    specialty: "",
    yearsOfExperience: "",
    licenseNumber: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dob: "",
    age: "",
    locationName: "",
    longitude: "",
    latitude: "",
    professionalBio: "",
    profile: null,
    degreePhoto: null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      }
      data.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: [formData.longitude, formData.latitude],
          locationName: formData.locationName,
        })
      );

      const res = await axios.post(
        "http://localhost:9191/api/v1/doctors/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.token) {
        const decoded = jwtDecode(res.data.token);
        localStorage.setItem("doctorToken", res.data.token);
        localStorage.setItem("doctorEmail", formData.email);
        localStorage.setItem("doctorId", decoded?.doctorId);
        navigate("/Doctor/Dashboard", {
          state: { toastMessage: "Registration successful 🎉" },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-blue-50 to-teal-50 px-4 mt-15">
            {/* ✅ Navbar */}
      <Navbar />
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Doctor Registration
        </h2>
        <p className="text-sm text-center text-gray-500 mb-2">
          Please Register to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="relative w-full">
  <select
    name="title"
    value={formData.title}
    onChange={handleChange}
    className="w-full appearance-none rounded-xl border border-gray-300 bg-white p-3 pr-10 
               text-gray-700 font-medium shadow-md 
               hover:border-blue-400 hover:bg-gray-50
               focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
  >
    <option value="">Select Title</option>
    <option value="Mr.">Mr.</option>
    <option value="Mrs.">Mrs.</option>
    <option value="Dr.">Dr.</option>
  </select>

  {/* Custom dropdown arrow */}
  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
    ▼
  </span>
</div>


            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              name="specialty"
              placeholder="Specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="number"
              name="yearsOfExperience"
              placeholder="Years of Experience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              name="locationName"
              placeholder="Location Name"
              value={formData.locationName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            {/* <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            /> */}
          </div>

          {/* Full-width fields */}
          <textarea
            name="professionalBio"
            placeholder="Professional Bio"
            value={formData.professionalBio}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          ></textarea>

          {/* <input
            type="file"
            name="profile"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm"
          />

          <input
            type="file"
            name="degreePhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm"
          /> */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
