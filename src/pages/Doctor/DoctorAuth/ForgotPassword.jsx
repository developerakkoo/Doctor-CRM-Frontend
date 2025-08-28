import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = ({ step, setStep, forgotEmail, setForgotEmail, setActiveTab }) => {
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
      setStep("reset");
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
      setStep(null);
      setActiveTab("login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return step === "request" ? (
    <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
      <input
        type="email"
        placeholder="Enter your registered email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        required
      />
      <button className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition">
        Send Reset Link
      </button>
    </form>
  ) : (
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
      <button className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition">
        Reset Password
      </button>
    </form>
  );
};

export default ForgotPassword;
