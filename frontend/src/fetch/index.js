import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// console.log(baseURL);

const fetch = axios.create({
  baseURL,
  withCredentials: true,
});

fetch.interceptors.request.use(
  (config) => {
    // Optional: Inject auth token
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

fetch.interceptors.response.use(
  (response) => {
    return response.data; // always return a value
  },
  (error) => {
    if (error instanceof AxiosError) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("session"); // if used
        window.location.href = "/";
        return Promise.reject(new Error("Unauthorized"));
      }

      if (status === 403) {
        toast.error(message || "Access denied.");
        setTimeout(() => {
          window.location.href = "/welcome";
        }, 3000);
        return Promise.reject(new Error("Access denied"));
      }

      console.log("Unhandled error:", error);
    }

    return Promise.reject(error);
  }
);

export { fetch };
