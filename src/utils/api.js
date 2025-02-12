import axios from "axios";

// Function to get JWT token from local storage
const getToken = () => localStorage.getItem("token");

// Set up axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add a request interceptor to add the token to headers when necessary
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.url !== "/auth/login" && config.url !== "/auth/signup") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
