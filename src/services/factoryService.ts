import { api } from "./api";

export const factoryService = {
  createFactory: async (data: any) => {
    const response = await api.post("/api/factories/", data);
    return response.data;
  },

  getFactories: async () => {
    const response = await api.get("/api/factories/");
    return response.data;
  },

  updateFactory: async (id: string, data: any) => {
    const response = await api.put(`/api/factories/${id}/`, data);
    return response.data;
  },
};