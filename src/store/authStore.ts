import { authService } from "@/services/authService";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type UserRole =
  | "super_admin"
  | "factory_admin"
  | "operator"
  | "supervisor"
  | "maintenance"
  | "engineer"
  | "viewer";

export interface User {
  id: number;
  national_code: string;
  phone_number: string;
  role: string;
  factory: number;
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  sendOtp: (
    nationalCode: string,
    phoneNumber: string,
  ) => Promise<SendOtpResult>;
  login: (
    nationalCode: string,
    phoneNumber: string,
    code: string,
    rememberMe: boolean,
  ) => Promise<boolean>;
  logout: () => void;
  canViewModule: (moduleId: string) => boolean;
}

const ROLE_MODULES: Record<string, string[]> = {
  super_admin: [
    "core",
    "superadmin",
    "org",
    "workflow",
    "dashboard-builder",
    "command-center",
    "idp",
    "mes",
    "alerts",
    "incidents",
    "cmms",
    "qms",
    "wms",
    "srm",
    "hse",
    "hrm",
    "dms",
    "finance",
    "lims",
    "ai",
    "report-builder",
    "form-builder",
    "marketplace",
    "nocode",
    "settings",
  ],
  factory_admin: [
    "core",
    "org",
    "workflow",
    "dashboard-builder",
    "command-center",
    "idp",
    "mes",
    "alerts",
    "incidents",
    "cmms",
    "qms",
    "wms",
    "srm",
    "hse",
    "hrm",
    "dms",
    "finance",
    "lims",
    "ai",
    "report-builder",
    "form-builder",
    "settings",
  ],
  manager: [
    "command-center",
    "mes",
    "idp",
    "alerts",
    "cmms",
    "qms",
    "wms",
    "srm",
    "hse",
    "hrm",
    "lims",
  ],
  supervisor: ["mes", "alerts", "incidents", "cmms", "qms", "wms", "hse"],
  operator: ["mes", "idp", "cmms", "qms", "wms", "hse"],
  maintenance: ["cmms"],
  engineer: ["idp", "mes", "alerts", "monitoring", "dashboard-builder"],
  viewer: ["command-center", "dashboard-builder"],
};

interface SendOtpResult {
  success: boolean;
  error: string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      sendOtp: async (nationalCode: string, phoneNumber: string) => {
        set({ loading: true, error: null });

        try {
          await authService.sendOtp(nationalCode, phoneNumber);

          set({ loading: false });

          return {
            success: true,
            error: null,
          };
        } catch (error: any) {
          console.log(error.response);
          const message = error.response?.data?.message || "خطا در ارسال کد";

          set({
            loading: false,
            error: message,
          });

          return {
            success: false,
            error: message,
          };
        }
      },
      login: async (nationalCode, phoneNumber, code, rememberMe) => {
        set({ loading: true, error: null });

        try {
          const data = await authService.verifyOtp(
            nationalCode,
            phoneNumber,
            code,
            rememberMe,
          );

          set({
            user: data.user,
            token: data.access,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          const message = error.response?.data?.message || "خطا در ورود";

          set({
            loading: false,
            error: message,
          });

          return false;
        }
      },
      logout: () => {
        localStorage.removeItem("auth-storage");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      canViewModule: (moduleId: string) => {
        const user = get().user;
        if (!user) return false;
        return ROLE_MODULES[user.role]?.includes(moduleId) ?? false;
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
