import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { modules } from '@/data/modules';
import { customPages } from '@/data/tenantData';
import type { CustomPageField } from '@/types/tenant';
import { uid } from '@/services/dataService';

// Phase 1
import { CorePlatformModule } from './phase1/CorePlatform';
import { SuperAdminModule } from './phase1/SuperAdmin';
import { OrganizationModule } from './phase1/OrganizationEngine';
import { WorkflowModule } from './phase1/WorkflowEngine';
import { DashboardBuilderModule } from './phase1/DashboardBuilder';

// Phase 2
import { IDPModule } from './phase2/IDPModule';
import { MESModuleFull } from './phase2/MESModule';
import { AlertCenterModule } from './phase2/AlertCenter';
import { IncidentEngineModule } from './phase2/IncidentEngine';
import { CommandCenterModule } from './phase2/CommandCenter';

// Phase 3
import { WMSModuleFull } from './phase3/WMSModule';
import { SRMModuleFull } from './phase3/SRMModule';
import { CMMSModuleFull } from './phase3/CMMSModule';
import { QMSModuleFull } from './phase3/QMSModule';
import { LIMSModuleFull } from './phase3/LIMSModule';

// Phase 4+5
import { HSEModule, HRMModuleFull, DMSModule, FinanceModule, ReportBuilderModule, FormBuilderModule, MarketplaceModule, NoCodeBuilderModule, AICopilotModule } from './phase45/AllModules';

// Legacy
import { PlaceholderModule } from './modules/GenericModule';
import { SettingsModule } from './modules/SettingsModule';

const fieldIcons: Record<string, string> = {text:'📝',number:'🔢',select:'📋',date:'📅',time:'⏰',textarea:'📄',checkbox:'✅',file:'📎',signature:'✍️',barcode:'📊',qr:'📱'};

function CustomPageRenderer() {
  const currentCustomPageId = useAppStore((s) => s.currentCustomPageId);
  const page = customPages.find(p => p.id === currentCustomPageId);
  const [formData, setFormData] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState<Record<string,string>[]>([]);

  if (!page) return <div className="text-zinc-500 text-center py-20">صفحه‌ای یافت نشد</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(prev => [...prev, { ...formData, id: uid(), submittedAt: new Date().toLocaleDateString('fa-IR')+' '+new Date().toLocaleTimeString('fa-IR') }]);
    setFormData({});
  };

  const catBg = page.category === 'plc' ? '#06b6d420' : page.category === 'lab' ? '#a855f720' : '#84cc1620';
  const catColor = page.category === 'plc' ? '#06b6d4' : page.category === 'lab' ? '#a855f7' : '#84cc16';
  const catLabel = page.category === 'plc' ? 'PLC' : page.category === 'lab' ? 'آزمایشگاه' : 'فرم';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: catBg, color: catColor }}>{page.category === 'plc' ? '⚙️' : page.category === 'lab' ? '🔬' : '📋'}</div>
        <div><h1 className="text-xl font-bold text-primary">{page.title}</h1><p className="text-zinc-500 text-xs"><span className="px-2 py-0.5 rounded text-[10px]" style={{ background: catBg, color: catColor }}>{catLabel}</span> — {page.factoryId}</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4">ثبت جدید</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {page.schema.map(field => (
              <div key={field.name}>
                <label className="block text-sm mb-1.5 text-zinc-400">{fieldIcons[field.type] || '📄'} {field.label}{field.required && <span className="text-red-400 mr-1">*</span>}</label>
                {field.type === 'select' ? (
                  <select value={formData[field.name]||''} onChange={e => setFormData(prev => ({...prev, [field.name]: e.target.value}))} required={field.required}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-primary text-sm outline-none focus:border-purple-500/50">
                    <option value="">انتخاب کنید...</option>
                    {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea value={formData[field.name]||''} onChange={e => setFormData(prev => ({...prev, [field.name]: e.target.value}))} placeholder={field.placeholder}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-primary text-sm outline-none focus:border-purple-500/50 min-h-[80px]" />
                ) : (
                  <input type={field.type === 'number' ? 'number' : 'text'} value={formData[field.name]||''} onChange={e => setFormData(prev => ({...prev, [field.name]: e.target.value}))} placeholder={field.placeholder} required={field.required}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-primary text-sm outline-none focus:border-purple-500/50" />
                )}
              </div>
            ))}
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">ارسال</button>
          </form>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4">تاریخچه ثبت‌ها ({submitted.length})</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {submitted.length === 0 && <p className="text-zinc-600 text-sm text-center py-8">هنوز داده‌ای ثبت نشده</p>}
            {submitted.map((s, i) => (
              <div key={s.id} className="bg-zinc-800/30 rounded-xl p-3 text-sm">
                <div className="flex justify-between text-xs text-zinc-500 mb-2"><span>#{i+1}</span><span>{s.submittedAt}</span></div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {page.schema.map(f => (
                    <div key={f.name}><span className="text-zinc-500">{f.label}:</span> <span className="text-primary">{s[f.name]||'-'}</span></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleContent() {
  const currentModule = useAppStore((s) => s.currentModule);
  const currentCustomPageId = useAppStore((s) => s.currentCustomPageId);
  const setCurrentModule = useAppStore((s) => s.setCurrentModule);
  const canViewModule = useAuthStore((s) => s.canViewModule);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && !canViewModule(currentModule) && !currentCustomPageId) {
      const first = modules.find(m => canViewModule(m.id));
      if (first) setCurrentModule(first.id);
    }
  }, [user, currentModule, currentCustomPageId]);

  if (currentCustomPageId) {
    return <CustomPageRenderer />;
  }

  switch (currentModule) {
    case 'core': return <CorePlatformModule />;
    case 'superadmin': return <SuperAdminModule />;
    case 'org': return <OrganizationModule />;
    case 'workflow': return <WorkflowModule />;
    case 'dashboard-builder': return <DashboardBuilderModule />;
    case 'idp': return <IDPModule />;
    case 'mes': return <MESModuleFull />;
    case 'alerts': return <AlertCenterModule />;
    case 'incidents': return <IncidentEngineModule />;
    case 'command-center': return <CommandCenterModule />;
    case 'wms': return <WMSModuleFull />;
    case 'srm': return <SRMModuleFull />;
    case 'cmms': return <CMMSModuleFull />;
    case 'qms': return <QMSModuleFull />;
    case 'lims': return <LIMSModuleFull />;
    case 'hse': return <HSEModule />;
    case 'hrm': return <HRMModuleFull />;
    case 'dms': return <DMSModule />;
    case 'finance': return <FinanceModule />;
    case 'ai': return <AICopilotModule />;
    case 'report-builder': return <ReportBuilderModule />;
    case 'form-builder': return <FormBuilderModule />;
    case 'marketplace': return <MarketplaceModule />;
    case 'nocode': return <NoCodeBuilderModule />;
    case 'settings': return <SettingsModule />;
    default: return <PlaceholderModule moduleId={currentModule} />;
  }
}

function SubNav() {
  const { currentModule, currentPage, setCurrentPage } = useAppStore();
  const mod = modules.find((m) => m.id === currentModule);
  if (!mod || mod.pages.length <= 1) return null;

  return (
    <div className="glass-border" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-glass)' }}>
      <div className="flex items-center gap-0.5 overflow-x-auto py-1 px-4 lg:px-6">
        {mod.pages.map((page) => {
          const Icon = page.icon;
          const isActive = currentPage === page.id;
          return (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className="flex items-center gap-1.5 px-3 py-[7px] text-[13px] whitespace-nowrap rounded-lg transition-all"
              style={isActive ? { background: '#00C2FF12', color: '#00C2FF' as string, fontWeight: 500 } : { color: 'var(--color-text-muted)' as string }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { if (!isActive) { e.currentTarget.style.background = '#1E293B40'; e.currentTarget.style.color = 'var(--color-text)'; } }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-muted)'; } }}>
              <Icon size={13} />
              {page.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Layout() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-surface)' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={toggleSidebar} />
      )}
      <div className={`fixed lg:relative z-50 lg:z-auto transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <SubNav />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ModuleContent />
        </main>
      </div>
    </div>
  );
}


