import { api } from "./api";

export const factoryMetaService = {
  getChoices: async () => {
    const { data } = await api.get("/api/factories/choices/");
    return data;
  },
};