import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const DoctorAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    yearsOfExperience: "",
    phone: "",
    address: "",
    dob: "",
    age: "",
    locationName: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveDoctorSession = (token, email, doctorId) => {
    localStorage.setItem("doctorToken", token);
    localStorage.setItem("doctorEmail", email);
    localStorage.setItem("doctorId", doctorId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post(
          "http://localhost:9191/api/v1/doctors/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (res.data.token) {
          const decoded = jwtDecode(res.data.token);
          saveDoctorSession(
            res.data.token,
            formData.email,
            decoded?.doctorId || ""
          );

          // ✅ Pass toast message via navigate state
          navigate("/Doctor/Dashboard", {
            state: { toastMessage: "Login successful 🎉" },
          });
        }
      } else {
        // REGISTER
        const res = await axios.post(
          "http://localhost:9191/api/v1/doctors/register",
          formData
        );

        if (res.data.token && res.data.doctor?._id) {
          saveDoctorSession(
            res.data.token,
            res.data.doctor.email,
            res.data.doctor._id
          );

          navigate("/Doctor/Dashboard", {
            state: { toastMessage: "Registration successful 🎉" },
          });
        }
      }
    } catch (error) {
      console.error("Auth error:", error.response?.data || error.message);

      // ❌ Show error toast on Auth page itself
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };


  // Forgot Password - request OTP
  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your registered email!");
      return;
    }

    try {
      await axios.post("http://localhost:9191/api/v1/doctors/reset-password-request", {
        email: forgotEmail,
      });

      toast.success("OTP sent to your email!");
      setShowForgotPassword(false);
      setShowResetPassword(true);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("OTP is required!");
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill both password fields!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:9191/api/v1/doctors/reset-password/", {
        email: forgotEmail,
        otp,
        newPassword,
      });

      toast.success("Password has been reset successfully!");
      setShowResetPassword(false);
      setIsLogin(true);
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };




  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          toastClassName={() =>
            "relative flex p-3 rounded-2xl justify-between items-center bg-white shadow-lg text-gray-900"
          }
        />

        <div
          className={`w-full max-w-md bg-white p-8 rounded-2xl shadow-lg ${!isLogin ? "mt-25" : ""
            }`}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            {showForgotPassword
              ? "Forgot Password"
              : showResetPassword
                ? "Reset Password"
                : isLogin
                  ? "Doctor Login"
                  : "Doctor Registration"}
          </h2>

          {/* Forgot Password */}
          {showForgotPassword ? (
            <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send Reset Link
              </button>
              <p className="text-center mt-2">
                <button
                  type="button"
                  className="text-blue-600 font-semibold hover:underline"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Login
                </button>
              </p>
            </form>
          ) : showResetPassword ? (
            // Reset Password
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />


              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            </form>
          ) : (
            // Login / Register
            <form onSubmit={handleSubmit} className={`space-y-4 ${!isLogin ? "mt-1" : " "}`}>
              {!isLogin && (
                <>
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
                  />
                  <input
                    type="number"
                    name="yearsOfExperience"
                    placeholder="Years of Experience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
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
                    placeholder="Date of Birth"
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
                </>
              )}

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
                {isLogin ? "Login" : "Register"}
              </button>

              {isLogin && (
                <p className="text-right mt-2">
                  <button
                    type="button"
                    className="text-blue-600 font-semibold hover:underline"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </p>
              )}
            </form>
          )}

          {/* Switch login/register */}
          {!showForgotPassword && !showResetPassword && (
            <p className="mt-6 text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default DoctorAuth;
