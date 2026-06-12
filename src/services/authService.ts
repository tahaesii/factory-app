import { api } from "./api";

export const authService = {
  sendOtp: async (
    nationalCode: string,
    phoneNumber: string
  ) => {
    const { data } = await api.post(
      "/api/accounts/login/send-code/",
      {
        national_code: nationalCode,
        phone_number: phoneNumber,
      }
    );

    return data;
  },

  verifyOtp: async (
    nationalCode: string,
    phoneNumber: string,
    code: string,
    rememberMe: boolean
  ) => {
    const { data } = await api.post(
      "/api/accounts/login/verify/",
      {
        national_code: nationalCode,
        phone_number: phoneNumber,
        code,
        remember_me: rememberMe,
      }
    );
    

    return data;
  },
};