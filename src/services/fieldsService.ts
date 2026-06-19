import { api } from "./api";

export const fieldsService = {
  createUnit: async (data: any) => {
    const response = await api.post("/api/accounts/units/", data);
    return response.data;
  },
  
  getUnit: async () => {
    const response = await api.get("/api/accounts/units/");
    return response.data;
  },
};