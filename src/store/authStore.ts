
import { create } from 'zustand';

export type UserRole = 'superadmin' | 'admin' | 'operator' | 'supervisor' | 'maintenance' | 'engineer' | 'viewer';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  phone?: string;
  departmentId?: string;
  factoryId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  canViewModule: (moduleId: string) => boolean;
}

const ROLE_MODULES: Record<string, string[]> = {
  superadmin: ['core','superadmin','org','workflow','dashboard-builder','command-center','idp','mes','alerts','incidents','cmms','qms','wms','srm','hse','hrm','dms','finance','lims','ai','report-builder','form-builder','marketplace','nocode','settings'],
  admin: ['core','org','workflow','dashboard-builder','command-center','idp','mes','alerts','incidents','cmms','qms','wms','srm','hse','hrm','dms','finance','lims','ai','report-builder','form-builder','settings'],
  manager: ['command-center','mes','idp','alerts','cmms','qms','wms','srm','hse','hrm','lims'],
  supervisor: ['mes','alerts','incidents','cmms','qms','wms','hse'],
  operator: ['mes','idp','cmms','qms','wms','hse'],
  maintenance: ['cmms'],
  engineer: ['idp','mes','alerts','monitoring','dashboard-builder'],
  viewer: ['command-center','dashboard-builder'],
};


export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://87.107.146.212:8080/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        set({ loading: false, error: err.message || 'خطا در ورود' });
        return false;
      }
      const data = await res.json();
      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch {
      set({ loading: false, error: 'خطا در اتصال به سرور' });
      return false;
    }
  },
  logout: () => set({ user: null, token: null, isAuthenticated: false, error: null }),
  canViewModule: (moduleId: string) => {
    const user = get().user;
    if (!user) return false;
    return ROLE_MODULES[user.role]?.includes(moduleId) ?? false;
  },
}));
