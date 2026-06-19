import axios from "axios";
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

const getUnits = async () => {
  try {

    const response = await api.get("/api/accounts/units/", {

    });

    console.log("Units:", response.data);
  } catch (error) {
    console.error(error);
  }
};

getUnits();