import { create } from 'zustand';
import { modules } from '@/data/modules';

export type ThemeMode = 'dark' | 'light';

interface AppState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  currentModule: string;
  currentPage: string;
  currentCustomPageId: string | null;
  theme: ThemeMode;
  notifications: Notification[];
  disabledModules: string[];
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setCurrentModule: (module: string) => void;
  setCurrentPage: (page: string) => void;
  setCurrentCustomPage: (pageId: string | null) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  addNotification: (n: Notification) => void;
  clearNotifications: () => void;
  acknowledgeNotification: (id: string) => void;
  toggleModule: (moduleId: string) => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  time: string;
  read: boolean;
  module?: string;
}

const defaultNotifications: Notification[] = [
  { id: '1', title: 'هشدار دمای بالا', message: 'دمای کوره ۲ به ۸۵۰°C رسید', type: 'warning', time: '۲ دقیقه پیش', read: false, module: 'IDP' },
  { id: '2', title: 'سفارش تولید تکمیل شد', message: 'سفارش PO-2024-0891 با موفقیت تکمیل شد', type: 'success', time: '۱۵ دقیقه پیش', read: false, module: 'MES' },
  { id: '3', title: 'درخواست خرید جدید', message: 'درخواست خرید PR-445 نیاز به تأیید دارد', type: 'info', time: '۳۰ دقیقه پیش', read: true, module: 'SRM' },
  { id: '4', title: 'خرابی ناگهانی', message: 'پمپ هیدرولیک خط ۳ از کار افتاد', type: 'error', time: '۴۵ دقیقه پیش', read: false, module: 'CMMS' },
  { id: '5', title: 'بازرسی کیفیت', message: 'بازرسی ورودی محموله M-2233 تکمیل شد', type: 'success', time: '۱ ساعت پیش', read: true, module: 'QMS' },
];

const getFirstPageForModule = (moduleId: string): string => {
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod || mod.pages.length === 0) return 'dashboard';
  return mod.pages[0].id;
};

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  currentModule: 'command-center',
  currentPage: getFirstPageForModule('command-center'),
  currentCustomPageId: null,
  theme: 'dark',
  notifications: defaultNotifications,
  disabledModules: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCurrentModule: (moduleId) => set({ currentModule: moduleId, currentPage: getFirstPageForModule(moduleId), currentCustomPageId: null }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setCurrentCustomPage: (pageId) => set({ currentCustomPageId: pageId, currentModule: '', currentPage: '' }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  clearNotifications: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  acknowledgeNotification: (id) => set((s) => ({
    notifications: s.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),
  toggleModule: (moduleId) => set((s) => ({
    disabledModules: s.disabledModules.includes(moduleId)
      ? s.disabledModules.filter(m => m !== moduleId)
      : [...s.disabledModules, moduleId],
  })),
}));
