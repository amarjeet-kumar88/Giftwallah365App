import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

/* 🔐 ATTACH TOKEN AUTOMATICALLY */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or auth store

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
