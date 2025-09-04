import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";;
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Navbar from "./Navbar";
import "react-toastify/dist/ReactToastify.css";



const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const saveDoctorSession = (token, email, doctorId) => {
    localStorage.setItem("doctorToken", token);
    localStorage.setItem("doctorEmail", email);
    localStorage.setItem("doctorId", doctorId);
  };

  // Normal Email/Password Login
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Form Data:", formData);

    const res = await axios.post(
      "http://localhost:9191/api/v1/doctors/login",
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Response:", res.data);

    if (!res.data.token) {
      toast.error(res.data.message || "Login failed!");
      return;
    }

    const decoded = jwtDecode(res.data.token);
    console.log("Decoded token:", decoded);
    saveDoctorSession(res.data.token, formData.email, decoded?.doctorId);

    navigate("/doctor/dashboard", {
      state: { toastMessage: "Login successful 🎉" },
    });
  } catch (error) {
    console.error("Login Error:", error.response || error);
    toast.error(error.response?.data?.message || "Something went wrong!");
  }
};



  // Google Auth Login
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = "http://localhost:9191/api/v1/doctors/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-4">
      {/* ✅ Navbar */}
      <Navbar />
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Doctor Login
        </h2>
        <p className="text-sm text-center text-gray-500">
          Please sign in to continue
        </p>

        {/* Email/Password Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

{/* Forgot password */}
<div className="flex justify-end mt-2">
  <Link
    to="/doctor/forgot-password"
    className="inline-block px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200"
  >
    Forgot Password?
  </Link>
</div>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <span className="flex-grow border-t border-gray-300"></span>
          <span className="text-xs text-gray-400 uppercase">Or</span>
          <span className="flex-grow border-t border-gray-300"></span>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 font-medium p-2 rounded-lg hover:bg-gray-200 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/doctor/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
