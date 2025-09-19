// frontend/src/api.js
import axios from "axios";

// Uses env var in production (Render), falls back to localhost in dev
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
});

// Automatically attach JWT from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
