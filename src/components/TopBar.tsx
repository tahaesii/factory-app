import { useState } from 'react';
import { Bell, Search, Moon, Sun, Menu, ChevronDown, Settings, LogOut, User, TriangleAlert, CheckCircle2, Info, XCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { modules } from '@/data/modules';

export default function TopBar() {
  const { currentModule, currentPage, setCurrentPage, toggleTheme, theme, notifications, clearNotifications, acknowledgeNotification, toggleSidebar } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const currentModuleDef = modules.find((m) => m.id === currentModule);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const notifIcon = (type: string) => {
    switch (type) {
      case 'warning': return <TriangleAlert size={14} className="text-[#F59E0B]" />;
      case 'error': return <XCircle size={14} className="text-[#EF4444]" />;
      case 'success': return <CheckCircle2 size={14} className="text-[#22C55E]" />;
      default: return <Info size={14} className="text-[#3B82F6]" />;
    }
  };

  const handleNotifClick = (id: string) => {
    acknowledgeNotification(id);
  };

  return (
    <header className="h-[52px] flex items-center justify-between px-4 sticky top-0 z-40 glass glass-border">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="lg:hidden" style={{ color: 'var(--color-text-secondary)' }}><Menu size={20} /></button>
        {currentModuleDef && (
          <div className="flex items-center gap-2 text-[13px]">
            <span style={{ color: 'var(--color-text-muted)' }}>{currentModuleDef.title}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <select value={currentPage} onChange={(e) => setCurrentPage(e.target.value)}
              className="appearance-none bg-transparent font-medium pr-0.5 pl-4 cursor-pointer focus:outline-none" style={{ color: 'var(--color-text)' }}>
              {currentModuleDef.pages.map((p) => (
                <option key={p.id} value={p.id} style={{ background: 'var(--color-card)' }}>{p.title}</option>
              ))}
            </select>
            <ChevronDown size={11} className="pointer-events-none -mr-3" style={{ color: 'var(--color-text-muted)' }} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={() => { const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }); window.dispatchEvent(e); }}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all"
          style={{ background: 'color-mix(in srgb, var(--color-card) 50%, transparent)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
          <Search size={12} /> جستجو
          <kbd className="text-[9px] px-1 py-0.5 rounded mr-1" style={{ background: 'var(--color-card)', color: 'var(--color-text-muted)' }}>⌘K</kbd>
        </button>

        <button onClick={toggleTheme}
          className="p-2 rounded-xl transition-all" style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-card)'; e.currentTarget.style.color = 'var(--color-text)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative">
          <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="p-2 rounded-xl transition-all relative" style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-card)'; e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold rounded-full" style={{ background: '#EF4444', color: '#fff' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 top-full mt-2 w-[380px] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-slide-up z-50" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h3 className="font-bold text-[14px]" style={{ color: 'var(--color-text)' }}>اعلان‌ها</h3>
                <button onClick={clearNotifications} className="text-[12px]" style={{ color: '#00C2FF' }}>خواندن همه</button>
              </div>
              <div className="max-h-[340px] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id}
                    onClick={() => handleNotifClick(n.id)}
                    className="px-4 py-3 transition-colors cursor-pointer"
                    style={{ borderBottom: '1px solid var(--color-border)', background: !n.read ? 'color-mix(in srgb, var(--color-card) 20%, transparent)' : '' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-card) 25%, transparent)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = !n.read ? 'color-mix(in srgb, var(--color-card) 20%, transparent)' : ''}>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">{notifIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>{n.title}</p>
                          {!n.read && <div className="w-2 h-2 rounded-full" style={{ background: '#00C2FF' }} />}
                        </div>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{n.message}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{n.time}</span>
                          {n.module && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--color-card)', color: 'var(--color-text-muted)' }}>{n.module}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 flex items-center gap-3 text-[10px]" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                <span>برای تأیید روی اعلان کلیک کنید</span>
                <span className="mr-auto">سکوت: ۵ | ۱۵ | ۳۰ | ۶۰ دقیقه</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-card)'}
            onMouseLeave={(e) => e.currentTarget.style.background = ''}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{ background: '#00C2FF20', color: '#00C2FF' }}>
              {user?.name?.charAt(0)}
            </div>
            <span className="text-[13px] hidden sm:block" style={{ color: 'var(--color-text-secondary)' }}>{user?.name}</span>
            <ChevronDown size={11} style={{ color: 'var(--color-text-muted)' }} />
          </button>

          {showProfile && (
            <div className="absolute left-0 top-full mt-2 w-52 rounded-xl shadow-2xl overflow-hidden animate-slide-up z-50" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="p-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>{user?.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }} dir="ltr">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#00C2FF15', color: '#00C2FF' }}>
                  {user?.role === 'superadmin' ? 'مدیر سیستم' : user?.role === 'manager' ? 'مدیر' : 'اپراتور'}
                </span>
              </div>
              <div className="p-1">
                <button onClick={() => { setShowProfile(false); setShowProfileModal(true); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all" style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-card)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
                  <User size={14} /> پروفایل
                </button>
                <button onClick={() => { setShowProfile(false); useAppStore.getState().setCurrentModule('settings'); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all" style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-card)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
                  <Settings size={14} /> تنظیمات
                </button>
                <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all" style={{ color: '#EF4444' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#EF444410'}
                  onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                  <LogOut size={14} /> خروج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowProfileModal(false)}>
          <div className="bg-card border-default rounded-2xl p-6 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: '#00C2FF20', color: '#00C2FF' }}>{user?.name?.charAt(0)}</div>
              <div><h3 className="text-primary font-bold">{user?.name}</h3><p className="text-muted text-xs" dir="ltr">{user?.email}</p></div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between bg-card/40 rounded-xl px-3 py-2"><span className="text-secondary">نقش</span><span className="text-primary">{user?.role === 'superadmin' ? 'مدیر سیستم' : user?.role === 'admin' ? 'مدیر ارشد' : user?.role === 'manager' ? 'مدیر' : 'اپراتور'}</span></div>
              {user?.factoryName && <div className="flex justify-between bg-card/40 rounded-xl px-3 py-2"><span className="text-secondary">کارخانه</span><span className="text-primary">{user.factoryName}</span></div>}
              {user?.department && <div className="flex justify-between bg-card/40 rounded-xl px-3 py-2"><span className="text-secondary">دپارتمان</span><span className="text-primary">{user.department}</span></div>}
            </div>
            <button onClick={() => setShowProfileModal(false)} className="w-full mt-4 py-2 bg-card hover:bg-card text-primary rounded-xl text-sm">بستن</button>
          </div>
        </div>
      )}
      {(showNotifications || showProfile) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowNotifications(false); setShowProfile(false); }} />
      )}
    </header>
  );
}
