import { useState } from 'react';
import { Settings, ChevronDown, ChevronLeft, LogOut, PanelLeftClose, PanelLeft, Command, LayoutDashboard } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { modules, moduleCategories } from '@/data/modules';
import { customPages } from '@/data/tenantData';

const BORDER = 'var(--color-border)';
const MUTED = 'var(--color-text-muted)';
const TEXT = 'var(--color-text)';
const CARD = 'var(--color-card)';
const PRIMARY = '#00C2FF';

export default function Sidebar() {
  const { currentModule, setCurrentModule, setCurrentPage, sidebarCollapsed, toggleSidebarCollapse, disabledModules } = useAppStore();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const canViewModule = useAuthStore((s) => s.canViewModule);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(moduleCategories.map(c => c.id));
  const visibleModules = modules.filter(m => canViewModule(m.id) && !disabledModules.includes(m.id));

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  // === COLLAPSED ===
  if (sidebarCollapsed) {
    return (
      <div className="w-[60px] flex flex-col h-screen sticky top-0 transition-all" style={{ background: CARD, borderLeft: `1px solid ${BORDER}` }}>
        <div className="p-2.5 flex items-center justify-center" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: PRIMARY }}>
            <Settings className="w-5 h-5 animate-spin-slow" style={{ color: '#020817' }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
          {visibleModules.map((mod) => {
            const Icon = mod.icon;
            const isActive = currentModule === mod.id;
            return (
              <button key={mod.id} onClick={() => { setCurrentModule(mod.id); setCurrentPage(mod.pages[0]?.id || 'dashboard'); }}
                title={mod.title}
                className="w-full p-2 rounded-xl flex items-center justify-center transition-all"
                style={isActive ? { background: `${PRIMARY}15`, color: PRIMARY } : { color: MUTED }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = BORDER; e.currentTarget.style.color = TEXT; }}}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = MUTED; }}}>
                <Icon size={18} />
              </button>
            );
          })}
        </div>
        <div className="p-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <button onClick={toggleSidebarCollapse} className="w-full p-2 rounded-xl flex items-center justify-center transition-all" style={{ color: MUTED }}>
            <PanelLeft size={16} />
          </button>
        </div>
      </div>
    );
  }

  // === FULL ===
  return (
    <div className="w-[250px] flex flex-col h-screen sticky top-0 transition-all" style={{ background: CARD, borderLeft: `1px solid ${BORDER}` }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: PRIMARY }}>
            <Settings className="w-4.5 h-4.5 animate-spin-slow" style={{ color: '#020817' }} />
          </div>
          <span className="text-[16px] font-[800]" style={{ color: TEXT }}>Factory<span style={{ color: PRIMARY }}>OS</span></span>
        </div>
        <button onClick={toggleSidebarCollapse} className="transition-colors" style={{ color: MUTED }}
          onMouseEnter={(e) => e.currentTarget.style.color = TEXT}
          onMouseLeave={(e) => e.currentTarget.style.color = MUTED}>
          <PanelLeftClose size={16} />
        </button>
      </div>

      <div className="px-3 py-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2" style={{ background: `${BORDER}40` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: `${PRIMARY}20`, color: PRIMARY }}>
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: TEXT }}>{user?.name}</p>
            <p className="text-[11px] truncate" style={{ color: MUTED }}>{user?.factory}</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <button className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] transition-all"
          style={{ background: `${BORDER}40`, color: MUTED, border: `1px solid ${BORDER}` }}
          onClick={() => { const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }); window.dispatchEvent(e); }}>
          <Command size={12} />
          <span className="flex-1 text-right">جستجوی سریع...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: BORDER }}>⌘K</kbd>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1 px-2">
        {/* Custom Pages for this factory */}
        {user && user.role !== 'superadmin' && (() => {
          const factoryPages = customPages.filter(p => p.factoryId === user.factoryId);
          if (factoryPages.length === 0) return null;
          return (
            <div className="mb-1">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>📋 صفحات سفارشی</div>
              <div className="space-y-px">
                {factoryPages.map(p => {
                  const isActive = useAppStore.getState().currentCustomPageId === p.id;
                  return (
                    <button key={p.id}
                      onClick={() => { useAppStore.getState().setCurrentCustomPage(p.id); }}
                      className="w-full flex items-center gap-2 px-3 py-[7px] rounded-xl text-[13px] transition-all"
                      style={isActive ? { background: '#a855f712', color: '#a855f7' as string, fontWeight: 500 } : { color: 'var(--color-text-secondary)' as string }}
                      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--color-border)50'; e.currentTarget.style.color = 'var(--color-text)'; }}}
                      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}}>
                      <LayoutDashboard size={15} style={{ color: p.category === 'plc' ? '#06b6d4' : p.category === 'lab' ? '#a855f7' : '#84cc16' }} />
                      <span className="truncate">{p.title}</span>
                      {isActive && <ChevronLeft size={12} className="mr-auto" />}
                    </button>
                  );
                })}
              </div>
              <div className="my-1 mx-3" style={{ borderTop: '1px solid var(--color-border)' }} />
            </div>
          );
        })()}
        {moduleCategories.map((cat) => {
          const catModules = visibleModules.filter((m) => m.category === cat.id);
          if (catModules.length === 0) return null;
          const isExpanded = expandedCategories.includes(cat.id);
          return (
            <div key={cat.id} className="mb-0.5">
              <button onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors" style={{ color: MUTED }}>
                <span>{cat.title}</span>
                <ChevronDown size={11} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isExpanded && (
                <div className="space-y-px">
                  {catModules.map((mod) => {
                    const Icon = mod.icon;
                    const isActive = currentModule === mod.id;
                    return (
                      <button key={mod.id}
                        onClick={() => { setCurrentModule(mod.id); setCurrentPage(mod.pages[0]?.id || 'dashboard'); }}
                        className="w-full flex items-center gap-2 px-3 py-[7px] rounded-xl text-[13px] transition-all"
                        style={isActive ? { background: `${PRIMARY}12`, color: PRIMARY, fontWeight: 500 } : { color: 'var(--color-text-secondary)' }}
                        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = `${BORDER}50`; e.currentTarget.style.color = TEXT; }}}
                        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}}>
                        <Icon size={15} style={isActive ? { color: PRIMARY } : undefined} />
                        <span className="truncate">{mod.title}</span>
                        {isActive && <ChevronLeft size={12} className="mr-auto" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-2" style={{ borderTop: `1px solid ${BORDER}` }}>
        <button onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] transition-all"
          style={{ color: '#EF4444' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#EF444410'}
          onMouseLeave={(e) => e.currentTarget.style.background = ''}>
          <LogOut size={15} />
          <span>خروج از سیستم</span>
        </button>
      </div>
    </div>
  );
}
