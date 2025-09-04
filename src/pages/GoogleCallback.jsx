// src/pages/GoogleCallback.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("doctorToken", token);
      navigate("/doctor/dashboard");
    }
  }, [location, navigate]);

  return <p>Logging you in...</p>;
}
