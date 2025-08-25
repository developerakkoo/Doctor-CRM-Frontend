// src/utils/session.js

// Save session (after login or register)
export const saveDoctorSession = (token, email, doctorId) => {
  localStorage.setItem("doctorToken", token);
  localStorage.setItem("doctorEmail", email);
  localStorage.setItem("doctorId", doctorId);
};

// Get session (used in App.jsx, Dashboard, etc.)
export const getDoctorSession = () => {
  const token = localStorage.getItem("doctorToken");
  const email = localStorage.getItem("doctorEmail");
  const doctorId = localStorage.getItem("doctorId");

  if (!token || !doctorId) return null;

  return { token, email, doctorId };
};

// Clear session (on logout)
export const clearDoctorSession = () => {
  localStorage.removeItem("doctorToken");
  localStorage.removeItem("doctorEmail");
  localStorage.removeItem("doctorId");
};
