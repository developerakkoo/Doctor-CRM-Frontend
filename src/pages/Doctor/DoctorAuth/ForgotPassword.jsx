import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState("request"); // ✅ Default step is "request"
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9191/api/v1/doctors/reset-password-request", {
        email: forgotEmail,
      });
      toast.success("OTP sent to your email!");
      setStep("reset"); // ✅ Move to reset step
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
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
      toast.success("Password reset successfully!");
      setStep("request"); // ✅ Reset flow back to email request
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />

      <div className="flex justify-center items-center px-4 py-10">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-6 mt-15">
          <h2 className="text-2xl font-bold text-center text-blue-700">
            Forgot Password
          </h2>

          {step === "request" ? (
            <>
              <p className="text-sm text-center text-gray-500">
                Enter your email to receive an OTP
              </p>
              <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <button className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition">
                  Send OTP
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-sm text-center text-gray-500">
                Enter OTP and set a new password
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <button className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition">
                  Reset Password
                </button>
              </form>
            </>
          )}

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Remembered your password?{" "}
            <Link
              to="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
