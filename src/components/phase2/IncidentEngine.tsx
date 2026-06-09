import { useState } from 'react';
import { TriangleAlert, CheckCircle2, Clock, FileText, Lock, ChevronDown, ChevronRight, Plus, Activity, BarChart3, Brain, Send, Camera, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import DataTable, { Column } from '@/components/ui/DataTable';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { uid } from '@/services/dataService';
import { incidents as initialIncidents, incidentTemplates, phase2ChartData } from '@/data/phase2Data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Incident, ChecklistItem, Action as IncidentAction } from '@/types/phase2';

const severityConfig: Record<string, { label: string; color: string; border: string }> = {
  low:      { label: 'کم',      color: 'text-blue-500',   border: 'border-blue-500/30' },
  medium:   { label: 'متوسط',   color: 'text-amber-500',  border: 'border-amber-500/30' },
  high:     { label: 'بالا',    color: 'text-orange-500', border: 'border-orange-500/30' },
  critical: { label: 'بحرانی',  color: 'text-red-500',    border: 'border-red-500/50' },
};
const statusConfig: Record<string, { label: string; bg: string }> = {
  open:             { label: 'باز',           bg: 'bg-red-500/10 text-red-500' },
  investigating:    { label: 'در بررسی',      bg: 'bg-amber-500/10 text-amber-500' },
  pending_approval: { label: 'در انتظار تأیید', bg: 'bg-indigo-500/10 text-indigo-500' },
  resolved:         { label: 'حل شده',        bg: 'bg-green-500/10 text-green-500' },
  closed:           { label: 'بسته',          bg: 'bg-card/10 text-muted' },
};

export function IncidentEngineModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  switch (currentPage) {
    case 'active': return <ActiveIncidentsPage onNavigate={setCurrentPage} />;
    case 'templates': return <TemplatesPage />;
    case 'rca': return <RCAPage />;
    case 'analytics': return <IncidentAnalyticsPage />;
    default: return <IncidentDashboard onNavigate={setCurrentPage} />;
  }
}

function IncidentDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [showNew, setShowNew] = useState(false);
  const openCount = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length;
  const lockedCount = incidents.filter(i => i.screenLocked).length;

  const handleAdd = (data: any) => {
    setIncidents(prev => [...prev, {
      id: uid('INC-'), code: `INC-${String(prev.length + 1).padStart(4, '0')}`,
      title: data.title, description: data.description, severity: data.severity, status: 'open',
      departmentId: '', departmentName: data.departmentName, lineId: '', lineName: data.lineName || '',
      machineId: '', machineName: data.machineName || '', source: data.source,
      reportedBy: '', reportedByName: data.reportedByName, openedAt: new Date().toLocaleString('fa'),
      resolvedAt: '', closedAt: '', downtime: 0, cost: 0, photos: [],
      screenLocked: false, checklistCompleted: false,
      checklist: [{ id: uid(), text: 'بررسی اولیه محل حادثه', type: 'checkbox', required: true, completed: false },
        { id: uid(), text: 'تکمیل فرم گزارش', type: 'text', required: true, completed: false }],
      actions: [{ id: uid(), description: 'بررسی و تحلیل علت', type: 'investigation', status: 'pending', assignedTo: data.reportedByName, dueDate: '', completedAt: '' }],
    } as Incident]);
    setShowNew(false);
  };

  const resolveIncident = (id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved', resolvedAt: new Date().toLocaleString('fa'), checklistCompleted: true, checklist: i.checklist.map(c => ({ ...c, completed: true })) } : i));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">موتور حوادث</h1>
          <p className="text-muted">مدیریت خطاها، خرابی‌ها و حوادث صنعتی</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl">
          <Plus size={16} /> گزارش حادثه
        </button>
      </div>

      <StatGrid columns={4}>
        <StatCard title="حوادث باز" value={openCount} icon={<TriangleAlert size={22} />} color="#ef4444" />
        <StatCard title="صفحات قفل" value={lockedCount} icon={<Lock size={22} />} color="#f97316" />
        <StatCard title="حوادث این ماه" value={incidents.length} icon={<Activity size={22} />} color="#8b5cf6" />
        <StatCard title="MTTR میانگین" value="۴.۵" unit="ساعت" icon={<Clock size={22} />} color="#3b82f6" />
      </StatGrid>

      {lockedCount > 0 && (
        <div className="bg-red-950/30 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3">
          <Lock size={24} className="text-red-500" />
          <div>
            <p className="text-white font-bold">⚠️ {lockedCount} اپراتور در حالت قفل صفحه هستند</p>
            <p className="text-red-400 text-sm">این اپراتورها باید چک‌لیست را تکمیل کنند تا صفحه‌شان باز شود</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} onResolve={resolveIncident} />
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'حوادث فعال', icon: TriangleAlert, color: '#ef4444', page: 'active' },
          { title: 'قالب‌ها', icon: FileText, color: '#3b82f6', page: 'templates' },
          { title: 'ریشه‌یابی (RCA)', icon: Brain, color: '#8b5cf6', page: 'rca' },
          { title: 'آنالیز', icon: BarChart3, color: '#10b981', page: 'analytics' },
        ].map((item) => (
          <button key={item.page} onClick={() => onNavigate(item.page)}
            className="bg-card border-default hover:border-default rounded-xl p-4 text-center transition-all group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}15` }}>
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <p className="text-primary text-sm font-medium">{item.title}</p>
          </button>
        ))}
      </div>

      <FormModal isOpen={showNew} onClose={() => setShowNew(false)} onSubmit={handleAdd}
        title="گزارش حادثه جدید" size="lg"
        fields={[
          { name: 'title', label: 'عنوان حادثه', type: 'text', required: true },
          { name: 'description', label: 'توضیحات', type: 'textarea', required: true, colSpan: 2 },
          { name: 'severity', label: 'شدت', type: 'select', required: true, options: [{ value: 'low', label: 'کم' },{ value: 'medium', label: 'متوسط' },{ value: 'high', label: 'بالا' },{ value: 'critical', label: 'بحرانی' }] },
          { name: 'departmentName', label: 'واحد', type: 'text', required: true },
          { name: 'source', label: 'منبع', type: 'text', required: true },
          { name: 'reportedByName', label: 'گزارش‌دهنده', type: 'text', required: true },
          { name: 'lineName', label: 'خط تولید', type: 'text' },
          { name: 'machineName', label: 'ماشین', type: 'text' },
        ]} />
    </div>
  );
}

function IncidentCard({ incident, onResolve }: { incident: Incident; onResolve: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(incident.checklist);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const sev = severityConfig[incident.severity];
  const stat = statusConfig[incident.status];
  const completedItems = checklist.filter(c => c.completed).length;
  const totalRequired = checklist.filter(c => c.required).length;

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed, completedBy: !c.completed ? 'کاربر فعلی' : undefined, completedAt: !c.completed ? new Date().toLocaleString('fa') : undefined } : c));
  };

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden ${sev.border}`}>
      {incident.screenLocked && !incident.checklistCompleted && (
        <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
          <Lock size={16} className="text-white" />
          <span className="text-white text-sm font-bold">صفحه اپراتور قفل است — تکمیل چک‌لیست الزامی</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-blue-400 text-xs">{incident.code}</span>
              <span className={`text-xs font-bold ${sev.color}`}>{sev.label}</span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${stat.bg}`}>{stat.label}</span>
              {incident.screenLocked && <Lock size={14} className="text-red-400" />}
            </div>
            <h3 className="text-primary font-bold text-lg">{incident.title}</h3>
            <p className="text-secondary text-sm mt-1">{incident.description}</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-muted hover:text-primary p-1">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3 text-xs text-muted">
          <div><span className="text-muted">واحد:</span> <span className="text-primary">{incident.departmentName}</span></div>
          {incident.machineName && <div><span className="text-muted">ماشین:</span> <span className="text-primary">{incident.machineName}</span></div>}
          <div><span className="text-muted">گزارش‌دهنده:</span> <span className="text-primary">{incident.reportedByName}</span></div>
          <div><span className="text-muted">زمان:</span> <span className="text-primary">{incident.openedAt}</span></div>
          {incident.downtime ? <div><span className="text-muted">توقف:</span> <span className="text-red-400">{incident.downtime} دقیقه</span></div> : null}
          {incident.cost ? <div><span className="text-muted">هزینه:</span> <span className="text-red-400">{incident.cost.toLocaleString()} ریال</span></div> : null}
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted">پیشرفت چک‌لیست</span>
            <span className={completedItems === totalRequired ? 'text-green-500' : 'text-amber-500'}>{completedItems} / {totalRequired}</span>
          </div>
          <div className="w-full bg-card rounded-full h-2">
            <div className={`h-2 rounded-full transition-all ${completedItems === totalRequired ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${(completedItems / totalRequired) * 100}%` }} />
          </div>
        </div>

        {expanded && (
          <div className="border-t pt-4 mt-4 space-y-4 animate-fade-in" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h4 className="text-primary font-bold mb-3 text-sm">چک‌لیست الزامی</h4>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <ChecklistItemRow key={item.id} item={item} onToggle={() => toggleChecklist(item.id)} />
                ))}
              </div>
            </div>

            {incident.actions.length > 0 && (
              <div>
                <h4 className="text-primary font-bold mb-3 text-sm">اقدامات</h4>
                <div className="space-y-2">
                  {incident.actions.map((action) => (
                    <div key={action.id} className="flex items-center gap-3 bg-card/50 rounded-xl p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${action.type === 'immediate' ? 'bg-red-500/10 text-red-500' : action.type === 'corrective' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {action.type === 'immediate' ? 'فوری' : action.type === 'corrective' ? 'اصلاحی' : 'پیشگیرانه'}</span>
                      <span className="text-primary text-sm flex-1">{action.description}</span>
                      <span className={`text-xs ${action.status === 'completed' ? 'text-green-500' : action.status === 'in_progress' ? 'text-amber-500' : 'text-muted'}`}>
                        {action.status === 'completed' ? '✓ تکمیل' : action.status === 'in_progress' ? '⟳ در حال' : '○ در انتظار'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => useAppStore.getState().setCurrentPage('rca')} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-xl transition-all">تحقیق RCA</button>
              {incident.status !== 'resolved' && incident.status !== 'closed' && (
                <button onClick={() => setShowResolveConfirm(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl transition-all">✓ حل شد</button>
              )}
              <button onClick={() => { const w=window.open(''); w?.document.write(`<html dir=rtl><h1>${incident.title}</h1><p>${incident.description}</p><hr/><pre>${JSON.stringify(incident,null,2)}</pre></html>`); w?.print(); }} className="px-4 py-2 bg-card hover:bg-card text-primary text-sm rounded-xl transition-all">گزارش PDF</button>
            </div>
          </div>
        )}
      </div>

      {showResolveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={() => setShowResolveConfirm(false)}>
          <div className="bg-card border-default rounded-2xl p-6 max-w-sm m-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-primary font-bold mb-2">تأیید حل حادثه</h3>
            <p className="text-secondary text-sm mb-4">آیا از حل شدن این حادثه اطمینان دارید؟ تمام آیتم‌های چک‌لیست تکمیل خواهد شد.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowResolveConfirm(false)} className="px-4 py-2 bg-card text-primary rounded-xl text-sm">انصراف</button>
              <button onClick={() => { onResolve(incident.id); setShowResolveConfirm(false); }} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm">✓ تأیید و حل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChecklistItemRow({ item, onToggle }: { item: ChecklistItem; onToggle: () => void }) {
  const typeIcon: Record<string, string> = { checkbox: '☑', photo: '📷', text: '📝', signature: '✍️' };
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${item.completed ? 'bg-green-500/5 border border-green-500/20' : 'bg-card/50'}`}>
      <span className="text-lg">{typeIcon[item.type] || '☑'}</span>
      <div className="flex-1">
        <span className={`text-sm ${item.completed ? 'text-secondary line-through' : 'text-primary'}`}>{item.text}</span>
        {item.required && !item.completed && <span className="text-red-500 text-xs mr-1">*</span>}
        {item.completedBy && <p className="text-muted text-xs mt-0.5">{item.completedBy} — {item.completedAt}</p>}
      </div>
      {item.completed ? (
        <CheckCircle2 size={16} className="text-green-500" />
      ) : (
        <button onClick={onToggle} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg">تکمیل</button>
      )}
    </div>
  );
}

function ActiveIncidentsPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [incidentList, setIncidentList] = useState<Incident[]>(initialIncidents);

  const columns: Column<Incident>[] = [
    { key: 'code', title: 'کد', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'title', title: 'عنوان' },
    { key: 'severity', title: 'شدت', render: (v) => <span className={`text-xs font-bold ${severityConfig[v]?.color}`}>{severityConfig[v]?.label}</span> },
    { key: 'status', title: 'وضعیت', render: (v) => <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${statusConfig[v]?.bg}`}>{statusConfig[v]?.label}</span> },
    { key: 'departmentName', title: 'واحد' },
    { key: 'source', title: 'منبع' },
    { key: 'lineName', title: 'خط' },
    { key: 'openedAt', title: 'زمان ثبت' },
  ];

  const handleAdd = (data: any) => {
    setIncidentList(prev => [...prev, {
      id: uid('INC-'), code: `INC-${String(prev.length + 1).padStart(4,'0')}`,
      title: data.title, description: data.description, severity: data.severity, status: 'open',
      departmentId: '', departmentName: data.departmentName, lineId: '', lineName: data.lineName || '',
      machineId: '', machineName: '', source: data.source,
      reportedBy: '', reportedByName: data.reportedByName, openedAt: new Date().toLocaleString('fa'),
      resolvedAt: '', closedAt: '', downtime: 0, cost: 0, photos: [],
      screenLocked: false, checklistCompleted: false,
      checklist: [{ id: uid(), text: 'بررسی اولیه', type: 'checkbox', required: true, completed: false }],
      actions: [],
    } as Incident]);
    setShowModal(false);
  };

  const resolveIncident = (id: string) => {
    setIncidentList(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved', resolvedAt: new Date().toLocaleString('fa') } : i));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">حوادث فعال</h1>
      </div>
      <DataTable data={incidentList} columns={columns} title="لیست حوادث"
        icon={<TriangleAlert size={18} className="text-red-500" />}
        onAdd={() => setShowModal(true)} addLabel="حادثه جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleAdd}
        title="گزارش حادثه جدید" size="lg"
        fields={[
          { name: 'title', label: 'عنوان حادثه', type: 'text', required: true },
          { name: 'description', label: 'توضیحات', type: 'textarea', required: true, colSpan: 2 },
          { name: 'severity', label: 'شدت', type: 'select', required: true, options: [{ value: 'low', label: 'کم' },{ value: 'medium', label: 'متوسط' },{ value: 'high', label: 'بالا' },{ value: 'critical', label: 'بحرانی' }] },
          { name: 'departmentName', label: 'واحد', type: 'text', required: true },
          { name: 'source', label: 'منبع', type: 'text', required: true },
          { name: 'reportedByName', label: 'گزارش‌دهنده', type: 'text', required: true },
          { name: 'lineName', label: 'خط تولید', type: 'text' },
        ]} />
      <div className="space-y-4">
        {incidentList.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} onResolve={resolveIncident} />
        ))}
      </div>
    </div>
  );
}

function TemplatesPage() {
  const [templates, setTemplates] = useState(incidentTemplates);
  const [showNew, setShowNew] = useState(false);

  const handleAdd = (data: any) => {
    setTemplates(prev => [...prev, {
      id: uid('TPL-'), code: `TPL-${String(prev.length + 1).padStart(3,'0')}`,
      title: data.title, description: data.description, severity: data.severity,
      screenLock: false, requirePhoto: false, requireSignature: false, requireSupervisorApproval: false,
      checklist: [{ id: uid(), text: 'بررسی اولیه', type: 'checkbox', required: true }],
      autoTasks: [],
    } as any]);
    setShowNew(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">قالب‌های حادثه</h1>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl"><Plus size={16} /> قالب جدید</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-card border-default rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-mono text-blue-400 text-xs">{template.code}</span>
                <h3 className="text-primary font-bold">{template.title}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${severityConfig[template.severity]?.color} bg-card`}>{severityConfig[template.severity]?.label}</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-4 text-xs text-muted">
                <span>📋 {template.checklist.length} آیتم چک‌لیست</span>
                <span>⚡ {template.autoTasks.length} اقدام خودکار</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.screenLock && <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">🔒 قفل صفحه</span>}
                {template.requirePhoto && <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">📷 عکس الزامی</span>}
                {template.requireSignature && <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">✍️ امضا الزامی</span>}
                {template.requireSupervisorApproval && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">✓ تأیید سرپرست</span>}
              </div>
            </div>
            <div className="space-y-1">
              {template.checklist.slice(0, 3).map((cl) => (
                <div key={cl.id} className="flex items-center gap-2 text-xs text-muted">
                  <span>{cl.type === 'checkbox' ? '☑' : cl.type === 'photo' ? '📷' : cl.type === 'signature' ? '✍️' : '📝'}</span>
                  <span>{cl.text}</span>
                  {cl.required && <span className="text-red-400">*</span>}
                </div>
              ))}
              {template.checklist.length > 3 && <p className="text-muted text-xs">+{template.checklist.length - 3} مورد دیگر</p>}
            </div>
          </div>
        ))}
      </div>

      <FormModal isOpen={showNew} onClose={() => setShowNew(false)} onSubmit={handleAdd}
        title="قالب حادثه جدید" fields={[
          { name: 'title', label: 'عنوان قالب', type: 'text', required: true },
          { name: 'description', label: 'توضیحات', type: 'textarea', colSpan: 2 },
          { name: 'severity', label: 'شدت پیش‌فرض', type: 'select', required: true, options: [{ value: 'low', label: 'کم' },{ value: 'medium', label: 'متوسط' },{ value: 'high', label: 'بالا' },{ value: 'critical', label: 'بحرانی' }] },
        ]} />
    </div>
  );
}

function RCAPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>('5why');
  const [problem, setProblem] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const methods = [
    { id: '5why', name: '۵ چرا (5 Why)', desc: 'ریشه‌یابی با پرسیدن ۵ بار چرا' },
    { id: 'fishbone', name: 'استخوان ماهی (Fishbone)', desc: 'نمودار ایشیکاوا — دسته‌بندی علل' },
    { id: 'fta', name: 'FTA', desc: 'تحلیل درخت خطا' },
    { id: 'fmea', name: 'FMEA', desc: 'تحلیل حالت و اثر خرابی' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">ریشه‌یابی (RCA)</h1>
      <div className="flex gap-2 flex-wrap">
        {methods.map((m) => (
          <button key={m.id} onClick={() => { setSelectedMethod(m.id); setShowAnalysis(false); }}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedMethod === m.id ? 'bg-blue-600 text-white' : 'bg-card text-secondary hover:text-primary'}`}>{m.name}</button>
        ))}
      </div>

      <div className="bg-card border-default rounded-2xl p-5">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm text-secondary mb-1">مشکل / حادثه</label>
            <input value={problem} onChange={e => setProblem(e.target.value)} placeholder="مثال: خرابی پمپ هیدرولیک خط ۳" className="w-full bg-card border-default rounded-xl px-3 py-2.5 text-primary text-sm outline-none focus:border-blue-500/50" />
          </div>
          <button onClick={() => setShowAnalysis(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap">تحلیل</button>
        </div>
      </div>

      {showAnalysis && selectedMethod === '5why' && (
        <div className="bg-card border-default rounded-2xl p-6">
          <h3 className="text-primary font-bold mb-4">تکنیک ۵ چرا — تحلیل "{problem || 'خرابی پمپ هیدرولیک'}"</h3>
          <div className="space-y-3">
            {[
              { q: 'چرا حادثه رخ داد؟ (۱)', a: 'پمپ هیدرولیک از کار افتاد' },
              { q: 'چرا پمپ از کار افتاد؟ (۲)', a: 'فیلتر روغن مسدود شده بود' },
              { q: 'چرا فیلتر مسدود شد؟ (۳)', a: 'برنامه تعویض فیلتر رعایت نشده' },
              { q: 'چرا برنامه رعایت نشد؟ (۴)', a: 'کارت نت پیشگیرانه موجود نبود' },
              { q: 'چرا کارت نت نداشتیم؟ (۵)', a: 'سیستم مدیریت نت پیاده‌سازی نشده', isRoot: true },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-xl ${item.isRoot ? 'bg-red-500/10 border border-red-500/30' : 'bg-card/50'}`}>
                <p className="text-muted text-xs">{item.q}</p>
                <p className={`font-medium mt-1 ${item.isRoot ? 'text-red-400' : 'text-primary'}`}>{item.a}</p>
                {item.isRoot && <p className="text-red-500 text-xs mt-1 font-bold">⚡ علت ریشه‌ای</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {showAnalysis && selectedMethod === 'fishbone' && (
        <div className="bg-card border-default rounded-2xl p-6">
          <h3 className="text-primary font-bold mb-4">نمودار استخوان ماهی (Fishbone / Ishikawa)</h3>
          <p className="text-secondary text-sm mb-6">علل بالقوه برای: <span className="text-primary font-bold">{problem || 'خرابی تجهیز'}</span></p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'نیروی انسانی', causes: ['عدم آموزش کافی', 'خطای اپراتور', 'خستگی کارکنان', 'تجربه ناکافی'], color: '#ef4444' },
              { title: 'ماشین‌آلات', causes: ['خرابی قطعه', 'نت پیشگیرانه ضعیف', 'فرسودگی', 'کالیبراسیون ناصحیح'], color: '#f59e0b' },
              { title: 'روش', causes: ['رویه نامناسب', 'عدم مستندات', 'فرآیند ناکارآمد', 'عدم بازبینی'], color: '#22c55e' },
              { title: 'مواد', causes: ['کیفیت پایین مواد', 'انقضای مواد', 'تغییر تأمین‌کننده', 'آلودگی'], color: '#3b82f6' },
              { title: 'اندازه‌گیری', causes: ['دقت پایین سنسور', 'کالیبراسیون', 'روش تست ناصحیح'], color: '#8b5cf6' },
              { title: 'محیط', causes: ['دما', 'رطوبت', 'نور', 'ارتعاش'], color: '#06b6d4' },
            ].map(cat => (
              <div key={cat.title} className="bg-card/40 rounded-xl p-3">
                <h4 className="text-sm font-bold mb-2" style={{ color: cat.color }}>{cat.title}</h4>
                <ul className="space-y-1">
                  {cat.causes.map(c => <li key={c} className="text-xs text-secondary flex items-center gap-1.5"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: cat.color }} />{c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAnalysis && selectedMethod === 'fta' && (
        <div className="bg-card border-default rounded-2xl p-6">
          <h3 className="text-primary font-bold mb-4">تحلیل درخت خطا (FTA)</h3>
          <p className="text-secondary text-sm mb-4">رویداد بالایی: <span className="text-primary font-bold">{problem || 'خرابی سیستم هیدرولیک'}</span></p>
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-400 font-bold text-lg">خرابی سیستم هیدرولیک</p>
              <p className="text-muted text-xs">OR Gate</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pr-8">
              {[
                { name: 'خرابی پمپ', children: ['یاتاقان خراب', 'شفت شکسته', 'کاویتاسیون'] },
                { name: 'خرابی شیر', children: ['شیر برقی', 'شیر فشارشکن', 'سیم پیچ سوخته'] },
                { name: 'نشت روغن', children: ['اورینگ پاره', 'لوله ترکیده', 'اتصال شل'] },
                { name: 'کنترل الکترونیکی', children: ['PLC خراب', 'سنسور', 'کابل قطع'] },
              ].map(branch => (
                <div key={branch.name} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                  <p className="text-amber-400 font-bold text-sm mb-2">{branch.name}</p>
                  <ul className="space-y-1">
                    {branch.children.map(ch => <li key={ch} className="text-xs text-secondary">• {ch}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAnalysis && selectedMethod === 'fmea' && (
        <div className="bg-card border-default rounded-2xl p-6 overflow-x-auto">
          <h3 className="text-primary font-bold mb-4">FMEA — تحلیل حالت و اثر خرابی</h3>
          <table className="w-full text-sm text-right">
            <thead><tr className="text-secondary text-xs border-b border-default">
              <th className="pb-2 px-2">فرآیند</th><th className="pb-2 px-2">حالت خرابی</th><th className="pb-2 px-2">علت</th><th className="pb-2 px-2">اثر</th><th className="pb-2 px-2 text-center">شدت</th><th className="pb-2 px-2 text-center">رخداد</th><th className="pb-2 px-2 text-center">کشف</th><th className="pb-2 px-2 text-center">RPN</th>
            </tr></thead>
            <tbody>
              {[
                { process: 'پمپاژ', mode: 'بدون جریان', cause: 'پمپ خراب', effect: 'توقف خط', S: 9, O: 4, D: 3 },
                { process: 'فیلتراسیون', mode: 'فیلتر مسدود', cause: 'عدم تعویض', effect: 'آلودگی روغن', S: 7, O: 6, D: 2 },
                { process: 'کنترل فشار', mode: 'فشار کم', cause: 'شیر خراب', effect: 'کاهش راندمان', S: 6, O: 3, D: 5 },
              ].map((row, i) => (
                <tr key={i} className="border-b border-default/50 text-primary">
                  <td className="py-2 px-2 text-xs">{row.process}</td>
                  <td className="py-2 px-2">{row.mode}</td>
                  <td className="py-2 px-2">{row.cause}</td>
                  <td className="py-2 px-2">{row.effect}</td>
                  <td className="py-2 px-2 text-center"><span className={`px-2 py-0.5 rounded text-xs ${row.S >= 8 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{row.S}</span></td>
                  <td className="py-2 px-2 text-center">{row.O}</td>
                  <td className="py-2 px-2 text-center">{row.D}</td>
                  <td className="py-2 px-2 text-center"><span className="font-bold text-blue-400">{row.S * row.O * row.D}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function IncidentAnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">آنالیز حوادث</h1>
      <StatGrid columns={4}>
        <StatCard title="زمان پاسخ" value="۱۵" unit="دقیقه" icon={<Clock size={22} />} color="#3b82f6" />
        <StatCard title="زمان تعمیر" value="۴.۵" unit="ساعت" icon={<Activity size={22} />} color="#f59e0b" />
        <StatCard title="تکراری" value="۲" icon={<BarChart3 size={22} />} color="#ef4444" />
        <StatCard title="بسته شده" value="۱" icon={<CheckCircle2 size={22} />} color="#10b981" />
      </StatGrid>
      <div className="bg-card border-default rounded-2xl p-5">
        <h3 className="text-primary font-bold mb-4">روند حوادث ماهانه</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={phase2ChartData.incidentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            <Bar dataKey="mechanical" fill="#ef4444" radius={[4, 4, 0, 0]} name="مکانیکی" />
            <Bar dataKey="electrical" fill="#f59e0b" radius={[4, 4, 0, 0]} name="الکتریکی" />
            <Bar dataKey="safety" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="ایمنی" />
            <Bar dataKey="quality" fill="#3b82f6" radius={[4, 4, 0, 0]} name="کیفیت" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'مکانیکی', value: 45, pct: 45, color: '#ef4444' },
            { label: 'الکتریکی', value: 25, pct: 25, color: '#f59e0b' },
            { label: 'ایمنی', value: 18, pct: 18, color: '#8b5cf6' },
            { label: 'کیفیت', value: 12, pct: 12, color: '#3b82f6' },
        ].map(item => (
          <div key={item.label} className="bg-card border-default rounded-xl p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-primary font-bold">{item.label}</span><span className="text-secondary">{item.value}%</span></div>
            <div className="w-full bg-card rounded-full h-2"><div className="h-2 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
