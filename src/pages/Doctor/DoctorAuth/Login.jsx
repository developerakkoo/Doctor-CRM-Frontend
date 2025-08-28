import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ setForgotPasswordStep }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const saveDoctorSession = (token, email, doctorId) => {
    localStorage.setItem("doctorToken", token);
    localStorage.setItem("doctorEmail", email);
    localStorage.setItem("doctorId", doctorId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:9191/api/v1/doctors/login",
        formData
      );

      if (res.data.token) {
        const decoded = jwtDecode(res.data.token);
        saveDoctorSession(res.data.token, formData.email, decoded?.doctorId);
        navigate("/Doctor/Dashboard", {
          state: { toastMessage: "Login successful 🎉" },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        Login
      </button>
      <p className="text-right mt-2">
        <button
          type="button"
          className="text-blue-600 font-semibold hover:underline"
          onClick={() => setForgotPasswordStep("request")}
        >
          Forgot Password?
        </button>
      </p>
    </form>
  );
};

export default Login;
