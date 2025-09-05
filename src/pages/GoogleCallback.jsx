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
      console.log("✅ Token saved to localStorage");

      // Redirect to dashboard
      navigate("/doctor/dashboard", { replace: true });
    } else {
      console.error("❌ No token found in callback URL");
      navigate("/login");
    }
  }, [location, navigate]);

  return <p>Logging you in...</p>;
}
