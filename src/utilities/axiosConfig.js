import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://ratback.advplus.pro/api",
  // baseURL: "http://advplus.test/api",
  timeout: 30000,
});

// 🔐 Attach token before every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔁 Always return response.data
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Optional: convert axios errors to cleaner messages
    return Promise.reject(
      error.response?.data || error.message || "Request failed"
    );
  }
);
