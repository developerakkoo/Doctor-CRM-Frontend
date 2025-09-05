import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9191/api/v1",
});

// ✅ Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("doctorToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
