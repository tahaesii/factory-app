import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useApiConfigStore } from "@/store/apiConfigStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const configuredBaseUrl = useApiConfigStore.getState().sensorAlertApiBaseUrl;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  /* Override baseURL with the user-configured value (defaults to VITE_API_URL) */
  if (configuredBaseUrl) {
    config.baseURL = configuredBaseUrl;
  }

  return config;
});
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      toast.error("مهلت استفاده شما به اتمام رسید، دوباره وارد شوید.");
      useAuthStore.getState().logout();
      setTimeout(() => {
        isLoggingOut = false;
      }, 1000);
    }

    return Promise.reject(error);
  }
);