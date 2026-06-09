import { useState } from 'react';
import { LayoutDashboard, BarChart3, PieChart as PieChartIcon, Gauge, Table, TriangleAlert, Calendar, Map, Brain, Plus, Move, Settings, Eye, Copy, Trash2, Save, Grid, X, Edit3 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import { uid } from '@/services/dataService';
import { dashboards as initialDashboards, dashboardTemplates } from '@/data/phase1Data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface WidgetInstance { id: string; type: string; title: string; w: number; h: number; data?: any; }
interface Dashboard { id: string; name: string; category: string; widgets: WidgetInstance[]; sharing: string; isDefault?: boolean; }

export function DashboardBuilderModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  switch (currentPage) {
    case 'builder': return <BuilderPage />;
    case 'widgets': return <WidgetsPage />;
    case 'templates': return <TemplatesPage onNavigate={setCurrentPage} />;
    case 'mydashboards': return <MyDashboardsPage onNavigate={setCurrentPage} />;
    default: return <DashboardBuilderDashboard onNavigate={setCurrentPage} />;
  }
}

function DashboardBuilderDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">داشبوردساز</h1><p className="text-zinc-500">ساخت داشبوردهای سفارشی با کشیدن و رها کردن ویجت‌ها</p></div>
      <StatGrid columns={4}>
        <StatCard title="داشبوردهای من" value={initialDashboards.length} icon={<LayoutDashboard size={22} />} color="#3b82f6" />
        <StatCard title="قالب‌های آماده" value={dashboardTemplates.length} icon={<Grid size={22} />} color="#10b981" />
        <StatCard title="انواع ویجت" value="8" icon={<BarChart3 size={22} />} color="#8b5cf6" />
        <StatCard title="انواع نمودار" value="8" icon={<PieChartIcon size={22} />} color="#f59e0b" />
      </StatGrid>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'ساخت داشبورد', icon: Plus, color: '#3b82f6', page: 'builder' },
          { title: 'کتابخانه ویجت', icon: Grid, color: '#10b981', page: 'widgets' },
          { title: 'قالب‌ها', icon: LayoutDashboard, color: '#8b5cf6', page: 'templates' },
          { title: 'داشبوردهای من', icon: Eye, color: '#f59e0b', page: 'mydashboards' },
        ].map((item) => (
          <button key={item.page} onClick={() => onNavigate(item.page)}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 text-center transition-all group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}15` }}>
              <item.icon size={24} style={{ color: item.color }} />
            </div>
            <p className="text-white font-medium">{item.title}</p>
          </button>
        ))}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">انواع ویجت‌ها</h3>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { name: 'KPI', icon: Gauge, color: '#3b82f6' }, { name: 'نمودار', icon: BarChart3, color: '#10b981' },
            { name: 'گیج', icon: Gauge, color: '#f59e0b' }, { name: 'جدول', icon: Table, color: '#8b5cf6' },
            { name: 'هشدار', icon: TriangleAlert, color: '#ef4444' }, { name: 'تقویم', icon: Calendar, color: '#06b6d4' },
            { name: 'نقشه', icon: Map, color: '#84cc16' }, { name: 'AI', icon: Brain, color: '#d946ef' },
          ].map((w) => (
            <div key={w.name} className="bg-zinc-800/50 rounded-xl p-3 text-center">
              <w.icon size={24} className="mx-auto mb-2" style={{ color: w.color }} />
              <p className="text-zinc-400 text-xs">{w.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const widgetTypes = [
  { id: 'kpi', name: 'KPI', icon: Gauge, color: '#3b82f6', defaultW: 3, defaultH: 1 },
  { id: 'chart', name: 'نمودار', icon: BarChart3, color: '#10b981', defaultW: 6, defaultH: 2 },
  { id: 'gauge', name: 'گیج', icon: Gauge, color: '#f59e0b', defaultW: 3, defaultH: 1 },
  { id: 'table', name: 'جدول', icon: Table, color: '#8b5cf6', defaultW: 6, defaultH: 2 },
  { id: 'alert', name: 'هشدار', icon: TriangleAlert, color: '#ef4444', defaultW: 4, defaultH: 1 },
  { id: 'chart-pie', name: 'نمودار دایره‌ای', icon: PieChartIcon, color: '#06b6d4', defaultW: 4, defaultH: 2 },
];

function BuilderPage() {
  const [widgets, setWidgets] = useState<WidgetInstance[]>([
    { id: uid(), type: 'kpi', title: 'OEE کلی', w: 3, h: 1, data: { value: '۸۶.۴%', sub: 'هدف ۸۵%' } },
    { id: uid(), type: 'kpi', title: 'تولید امروز', w: 3, h: 1, data: { value: '۴,۸۵۰', sub: 'از ۵,۲۰۰' } },
    { id: uid(), type: 'kpi', title: 'توقفات', w: 3, h: 1, data: { value: '۲.۳h', sub: 'کاهش ۱۵٪' } },
    { id: uid(), type: 'kpi', title: 'کیفیت', w: 3, h: 1, data: { value: '۹۶.۲٪', sub: 'عیب ۱.۸٪' } },
    { id: uid(), type: 'chart', title: 'روند تولید هفتگی', w: 6, h: 2, data: {} },
    { id: uid(), type: 'alert', title: 'هشدارهای فعال', w: 4, h: 1, data: { alerts: [{ text: 'پمپ هیدرولیک', sev: 'critical' }, { text: 'دمای کوره', sev: 'warning' }] } },
    { id: uid(), type: 'chart-pie', title: 'توزیع محصولات', w: 4, h: 2, data: {} },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dbName, setDbName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>(initialDashboards);
  const [saved, setSaved] = useState(false);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const sampleData = [
    { name: 'شنبه', value: 65 }, { name: 'یکشنبه', value: 72 }, { name: 'دوشنبه', value: 80 },
    { name: 'سه‌شنبه', value: 75 }, { name: 'چهارشنبه', value: 85 }, { name: 'پنجشنبه', value: 90 }, { name: 'جمعه', value: 78 },
  ];

  const addWidget = (typeId: string) => {
    const wt = widgetTypes.find(w => w.id === typeId);
    if (!wt) return;
    setWidgets(prev => [...prev, { id: uid(), type: typeId, title: wt.name, w: wt.defaultW, h: wt.defaultH, data: typeId === 'kpi' ? { value: '۰', sub: '' } : {} }]);
    setShowAddModal(false);
  };

  const removeWidget = (id: string) => setWidgets(prev => prev.filter(w => w.id !== id));

  const startEdit = (id: string, current: string) => { setEditingTitle(id); setEditValue(current); };
  const finishEdit = (id: string) => { setWidgets(prev => prev.map(w => w.id === id ? { ...w, title: editValue } : w)); setEditingTitle(null); };

  const handleSave = () => {
    if (!dbName.trim()) return;
    setDashboards(prev => [...prev, { id: uid('DB-'), name: dbName, category: 'custom', widgets: [...widgets], sharing: 'private' }]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowSaveModal(false); setDbName(''); }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">ساخت داشبورد</h1>
          <p className="text-zinc-500 text-sm">ویجت‌ها را اضافه، ویرایش و مرتب کنید — {widgets.length} ویجت</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-xl"><Plus size={16} /> افزودن ویجت</button>
          <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl"><Save size={16} /> ذخیره</button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-44 space-y-1">
          <p className="text-zinc-500 text-xs font-medium mb-2">ویجت‌ها</p>
          {widgetTypes.map(w => (
            <button key={w.id} onClick={() => addWidget(w.id)}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl text-sm bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
              <w.icon size={15} style={{ color: w.color }} /> {w.name}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 min-h-[500px]">
          <div className="grid grid-cols-12 gap-3">
            {widgets.map(w => (
              <div key={w.id} className="bg-zinc-800 rounded-xl p-4 border border-dashed border-zinc-700 group relative hover:border-blue-500/30 transition-colors"
                style={{ gridColumn: `span ${w.w}` }}>
                <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button onClick={() => removeWidget(w.id)} className="p-1 bg-red-500/20 rounded text-red-400 hover:text-red-300"><X size={12} /></button>
                </div>
                {editingTitle === w.id ? (
                  <input value={editValue} onChange={e => setEditValue(e.target.value)}
                    onBlur={() => finishEdit(w.id)} onKeyDown={e => e.key === 'Enter' && finishEdit(w.id)}
                    className="bg-zinc-700 border border-blue-500 rounded px-2 py-0.5 text-white text-xs w-full outline-none" autoFocus />
                ) : (
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-zinc-500 text-xs flex-1">{w.title}</p>
                    <button onClick={() => startEdit(w.id, w.title)} className="text-zinc-600 hover:text-zinc-300"><Edit3 size={10} /></button>
                  </div>
                )}
                {w.type === 'kpi' && <p className="text-2xl font-black text-white">{w.data?.value || '۰'}</p>}
                {w.data?.sub && <p className="text-zinc-500 text-xs mt-1">{w.data.sub}</p>}
                {w.type === 'chart' && (
                  <ResponsiveContainer width="100%" height={parseInt(w.h.toString()) * 80}>
                    <AreaChart data={sampleData}>
                      <defs><linearGradient id={`grad${w.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#71717a', fontSize: 10 }} />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" fill={`url(#grad${w.id})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                {w.type === 'alert' && w.data?.alerts?.map((a: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs mt-1"><div className={`w-2 h-2 rounded-full ${a.sev === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} /><span className="text-zinc-300">{a.text}</span></div>
                ))}
                {w.type === 'chart-pie' && (
                  <div className="flex items-center gap-2 mt-2">
                    {[{ label: 'محصول A', pct: 45, color: '#3b82f6' }, { label: 'محصول B', pct: 30, color: '#10b981' }, { label: 'محصول C', pct: 25, color: '#f59e0b' }].map(d => (
                      <div key={d.label} className="flex items-center gap-1 text-xs"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-zinc-400">{d.label} {d.pct}%</span></div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={() => setShowAddModal(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm m-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold mb-4">انتخاب ویجت</h3>
            <div className="grid grid-cols-2 gap-3">
              {widgetTypes.map(w => (
                <button key={w.id} onClick={() => addWidget(w.id)}
                  className="flex flex-col items-center gap-2 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all">
                  <w.icon size={24} style={{ color: w.color }} />
                  <span className="text-white text-sm">{w.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={() => setShowSaveModal(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full m-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold mb-4">ذخیره داشبورد</h3>
            <input value={dbName} onChange={e => setDbName(e.target.value)} placeholder="نام داشبورد" autoFocus
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/50 mb-4" />
            <button onClick={handleSave} disabled={!dbName.trim()} className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              {saved ? '✓ ذخیره شد' : 'ذخیره'}
            </button>
          </div>
        </div>
      )}

      {saved && <div className="fixed bottom-6 left-6 bg-green-600 text-white px-4 py-2 rounded-xl text-sm z-50 animate-fade-in">✓ داشبورد "{dbName}" ذخیره شد</div>}
    </div>
  );
}

function WidgetsPage() {
  const chartTypes = [
    { name: 'خطی', type: 'line', icon: '📈' }, { name: 'میله‌ای', type: 'bar', icon: '📊' }, { name: 'دایره‌ای', type: 'pie', icon: '🥧' },
    { name: 'دونات', type: 'donut', icon: '🍩' }, { name: 'ناحیه‌ای', type: 'area', icon: '📉' }, { name: 'حرارتی', type: 'heatmap', icon: '🗺️' },
    { name: 'رادار', type: 'radar', icon: '📡' }, { name: 'پراکندگی', type: 'scatter', icon: '⚬' },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-xl font-bold text-white">کتابخانه ویجت‌ها</h1><p className="text-zinc-500 text-sm">انواع ویجت و نمودارهای قابل استفاده</p></div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">انواع ویجت</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'KPI', desc: 'نمایش شاخص عددی با هدف و روند', icon: Gauge, color: '#3b82f6' },
            { name: 'جدول', desc: 'نمایش داده‌ها به صورت جدولی', icon: Table, color: '#10b981' },
            { name: 'گیج', desc: 'نمایش مقدار در بازه مشخص', icon: Gauge, color: '#f59e0b' },
            { name: 'هشدار', desc: 'نمایش هشدارهای فعال', icon: TriangleAlert, color: '#ef4444' },
            { name: 'تقویم', desc: 'نمایش رویدادها و برنامه‌ها', icon: Calendar, color: '#06b6d4' },
            { name: 'نقشه', desc: 'نمایش موقعیت جغرافیایی', icon: Map, color: '#84cc16' },
            { name: 'AI', desc: 'پیش‌بینی و تحلیل هوشمند', icon: Brain, color: '#d946ef' },
            { name: 'سفارشی', desc: 'ویجت با کد اختصاصی', icon: Settings, color: '#6b7280' },
          ].map((w) => (
            <div key={w.name} className="bg-zinc-800/50 rounded-xl p-4">
              <w.icon size={24} className="mb-2" style={{ color: w.color }} />
              <h4 className="text-white font-medium">{w.name}</h4>
              <p className="text-zinc-500 text-xs mt-1">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">انواع نمودار</h3>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {chartTypes.map((c) => (
            <div key={c.type} className="bg-zinc-800/50 rounded-xl p-4 text-center">
              <span className="text-3xl">{c.icon}</span>
              <p className="text-zinc-400 text-xs mt-2">{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplatesPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [dashboards, setDashboards] = useState<Dashboard[]>(initialDashboards);
  const categoryColors: Record<string, string> = { ceo: '#f59e0b', production: '#10b981', warehouse: '#3b82f6', maintenance: '#ef4444', hse: '#eab308', quality: '#22c55e', hr: '#ec4899', finance: '#06b6d4', custom: '#6b7280' };
  const categoryLabels: Record<string, string> = { ceo: 'مدیرعامل', production: 'تولید', warehouse: 'انبار', maintenance: 'نگهداری', hse: 'HSE', quality: 'کیفیت', hr: 'HR', finance: 'مالی', custom: 'سفارشی' };

  const useTemplate = (tpl: typeof dashboardTemplates[0]) => {
    const newDb: Dashboard = { id: uid('DB-'), name: tpl.name, category: tpl.category, sharing: 'private', widgets: tpl.widgets as WidgetInstance[] || [] };
    setDashboards(prev => [...prev, newDb]);
    onNavigate('mydashboards');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-xl font-bold text-white">قالب‌های داشبورد</h1><p className="text-zinc-500 text-sm">قالب‌های آماده برای شروع سریع</p></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardTemplates.map((template) => (
          <div key={template.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all group">
            <div className="h-32 bg-zinc-800 flex items-center justify-center"><LayoutDashboard size={48} className="text-zinc-600 group-hover:text-zinc-500 transition-colors" /></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold text-sm">{template.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: `${categoryColors[template.category]}20`, color: categoryColors[template.category] }}>{categoryLabels[template.category]}</span>
              </div>
              <p className="text-zinc-500 text-xs mb-3">{template.description}</p>
              <button onClick={() => useTemplate(template)}
                className="w-full py-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl text-sm font-medium transition-all">استفاده</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyDashboardsPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [dashboards, setDashboards] = useState<Dashboard[]>(initialDashboards);

  const remove = (id: string) => setDashboards(prev => prev.filter(d => d.id !== id));
  const clone = (db: Dashboard) => setDashboards(prev => [...prev, { ...db, id: uid('DB-'), name: db.name + ' (کپی)', isDefault: false }]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">داشبوردهای من</h1><p className="text-zinc-500 text-sm">داشبوردهای ایجاد شده توسط شما — {dashboards.length} عدد</p></div>
        <button onClick={() => onNavigate('builder')} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl"><Plus size={16} /> داشبورد جدید</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map((db) => (
          <div key={db.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all">
            <div className="h-40 bg-zinc-800 p-3">
              <div className="grid grid-cols-4 gap-1 h-full">
                <div className="bg-zinc-700 rounded col-span-1" /><div className="bg-zinc-700 rounded col-span-1" />
                <div className="bg-zinc-700 rounded col-span-1" /><div className="bg-zinc-700 rounded col-span-1" />
                <div className="bg-zinc-700 rounded col-span-3 row-span-2" /><div className="bg-zinc-700 rounded col-span-1 row-span-2" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold">{db.name}</h3>
                {db.isDefault && <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">پیش‌فرض</span>}
              </div>
              <p className="text-zinc-500 text-xs mb-3">{db.widgets?.length || 0} ویجت • {db.sharing === 'private' ? 'خصوصی' : 'اشتراکی'}</p>
              <div className="flex gap-2">
                <button onClick={() => onNavigate('builder')} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm flex items-center justify-center gap-1"><Eye size={14} /> مشاهده</button>
                <button onClick={() => clone(db)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl"><Copy size={14} /></button>
                <button onClick={() => remove(db.id)} className="p-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 rounded-xl"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
