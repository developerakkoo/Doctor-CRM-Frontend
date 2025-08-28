import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8">

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <select
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Title</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Dr.">Dr.</option>
                        </select>

                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                            required
                        />

                        <input
                            type="text"
                            name="specialty"
                            placeholder="Specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                            required
                        />

                        <input
                            type="number"
                            name="yearsOfExperience"
                            placeholder="Years of Experience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                            required
                        />

                        <input
                            type="text"
                            name="licenseNumber"
                            placeholder="License Number"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="text"
                            name="locationName"
                            placeholder="Location Name"
                            value={formData.locationName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        {/* <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            /> */}

                        {/* Textarea full width */}
                        <textarea
                            name="professionalBio"
                            placeholder="Professional Bio"
                            value={formData.professionalBio}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 col-span-1 md:col-span-2 lg:col-span-3"
                        ></textarea>

                        {/* File Uploads */}
                        {/* <input
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-1 md:col-span-2 lg:col-span-3"
            />
            <input
              type="file"
              name="degreePhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-1 md:col-span-2 lg:col-span-3"
            /> */}
                    </div>

                    {/* Email & Password */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
