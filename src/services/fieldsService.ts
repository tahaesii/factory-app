import { api } from "./api";

export interface ChoiceItem {
  id: number;
  code: string;
  label: string;
  is_active: boolean;
  created_at: string;
}

export interface UnitItem {
  id: number;
  name: string;
  factory: number;
  is_active: boolean;
  created_at: string;
}

export interface ParentFieldItem {
  id: number;
  english_name: string;
  persian_name: string;
  factory: string;
}

export interface ParentField {
  id: number;
  english_name: string;
  persian_name: string;
  items: ParentFieldItem[];
}

export const fieldsService = {
  createUnit: async (data: any) => {
    const response = await api.post("/api/accounts/units/", data);
    return response.data;
  },

  getUnit: async () => {
    const response = await api.get("/api/accounts/units/");
    return response.data;
  },
  getChoices: async (): Promise<ParentField[]> => {
    const { data } = await api.get("/api/accounts/choices/");
    console.log(data);
    return data;
  },

  createChoice: async (
    type: string,
    payload: {
      code: string;
      label: string;
      is_active: boolean;
    },
  ) => {
    const { data } = await api.post(
      `/api/accounts/choices/?type=${type}`,
      payload,
    );

    return data;
  },
  deleteChoice: async (id: number, type: string) => {
    await api.delete(`/api/accounts/choices/${id}/`, {
      params: {
        type,
      },
    });
  },
};
