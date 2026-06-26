import { api } from "./api";

export const userService = {
  createUser: async (data: any) => {
    const response = await api.post("/api/accounts/users/", data);
    return response.data;
  },

  getUser: async () => {
    const response = await api.get("/api/accounts/users/");
    return response.data;
  },

  updateUser: async (id: number, data: any) => {
    const response = await api.put(`/api/accounts/users/${id}/`, data);
    return response.data;
  },
};
