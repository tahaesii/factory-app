import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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