import { api } from "./api";

export interface GetFactoriesParams {
  search?: string;
  industry?: string;
  plan?: string;
  status?: string;
  is_active?: boolean;
}

export const factoryService = {
  createFactory: async (data: any) => {
    const response = await api.post("/api/factories/", data);
    return response.data;
  },

  getFactories: async (params?: GetFactoriesParams) => {
    const response = await api.get("/api/factories/", {
      params,
    });

    return response.data;
  },

  updateFactory: async (id: number, data: any) => {
    const response = await api.put(`/api/factories/${id}/`, data);
    return response.data;
  },
};
