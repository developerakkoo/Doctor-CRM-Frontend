// GoogleAuthHandler.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const token = queryParams.get("token");
    const id = queryParams.get("id");
    const name = queryParams.get("name");
    const email = queryParams.get("email");

    if (token && id) {
      localStorage.setItem("doctorToken", token);
      localStorage.setItem("doctorId", id);
      localStorage.setItem(
        "doctorUser",
        JSON.stringify({ id, name, email })
      );
      localStorage.setItem("doctorEmail", email)

      navigate("/doctor/dashboard");
    } else {
      console.error("Missing Google auth data");
      navigate("/");
    }
  }, [location, navigate]);

  return <div>Processing Google login...</div>;
};

export default GoogleAuthHandler;
