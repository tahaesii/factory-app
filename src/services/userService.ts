import { api } from "./api";

export interface GetUsersParams {
  search?: string;
  factory?: string;
  role?: string;
  employment_type?: string;
  shift?: string;
  status?: string;
  unit?: string;
  is_active?: boolean;
}

export const userService = {
  createUser: async (data: any) => {
    const response = await api.post("/api/accounts/users/", data);
    return response.data;
  },

  getUsers: async (params?: GetUsersParams) => {
    const response = await api.get("/api/accounts/users/", {
      params,
    });

    return response.data;
  },

  updateUser: async (id: number, data: any) => {
    const response = await api.put(`/api/accounts/users/${id}/`, data);
    return response.data;
  },
};
