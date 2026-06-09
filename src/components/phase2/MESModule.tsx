import { useState, useMemo, useEffect } from 'react';
import { uid } from '@/services/dataService';
import { Factory, Gauge, Clock, TriangleAlert, BarChart3, Play, Square, CheckCircle2, XCircle, TrendingDown, Activity, Bell, Camera, Shield, Trash2, Cpu } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { productionLines, productionOrders, downtimeRecords, scrapRecords, oeeCalculations, shifts, phase2ChartData, tags, formulas, incidents } from '@/data/phase2Data';
import { alerts } from '@/data/phase2Data';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { ProductionOrder, DowntimeRecord, ScrapRecord, Shift, ProductionEntry, OEECalculation, Alert, Tag, Incident } from '@/types/phase2';

const statusColors: Record<string, string> = {
  running: 'bg-green-500/10 text-green-500', stopped: 'bg-red-500/10 text-red-500',
  setup: 'bg-blue-500/10 text-blue-500', maintenance: 'bg-amber-500/10 text-amber-500',
  alarm: 'bg-red-500/10 text-red-500 animate-pulse',
  active: 'bg-green-500/10 text-green-500', planned: 'bg-zinc-500/10 text-zinc-400',
  completed: 'bg-blue-500/10 text-blue-500', paused: 'bg-amber-500/10 text-amber-500',
  cancelled: 'bg-red-500/10 text-red-500', delayed: 'bg-orange-500/10 text-orange-500',
};
const statusLabels: Record<string, string> = {
  running: 'در حال کار', stopped: 'متوقف', setup: 'راه‌اندازی',
  maintenance: 'نگهداری', alarm: 'هشدار', active: 'فعال',
  planned: 'برنامه‌ریزی', completed: 'تکمیل', paused: 'مکث',
  cancelled: 'لغو', delayed: 'تأخیر',
};

export function MESModuleFull() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch (currentPage) {
    case 'orders': return <ProductionOrdersPage />;
    case 'lines': return <LinesPage />;
    case 'oee': return <OEEPage />;
    case 'downtime': return <DowntimePage />;
    case 'scrap': return <ScrapPage />;
    case 'shifts': return <ShiftsPage />;
    case 'entry': return <ProductionEntryPage />;
    case 'monitoring': return <LiveMonitoringPage />;
    case 'incidents': return <LineIncidentsPage />;
    default: return <MESDashboard />;
  }
}

/* ==============================
   SCREEN LOCK OVERLAY
   ============================== */
function ScreenLockOverlay({ incident, onComplete }: { incident: Incident; onComplete: () => void }) {
  const [checklist, setChecklist] = useState(incident.checklist.map(c => ({ ...c, completed: c.completed || false, value: '' })));
  const [supervisorApproved, setSupervisorApproved] = useState(false);
  const [showApprovalInput, setShowApprovalInput] = useState(false);
  const [approvalCode, setApprovalCode] = useState('');

  const allRequiredDone = checklist.filter(c => c.required).every(c => c.completed);
  const needsSupervisor = incident.supervisorId && incident.templateId === 'IT-001';

  const handleCheck = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const handleText = (id: string, val: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, value: val, completed: val.trim().length > 0 } : c));
  };

  const handlePhoto = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, completed: true, value: 'photo_captured.jpg' } : c));
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4" style={{ direction: 'rtl' }}>
      <div className="bg-card border-2 border-red-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl shadow-red-500/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <Shield size={22} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-primary font-bold text-lg">قفل ایمنی فعال شد</h2>
            <p className="text-secondary text-xs">خط تولید تا تکمیل چک‌لیست قفل است</p>
          </div>
          <div className="mr-auto flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-medium">LOCKED</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-3 mb-4 border border-default">
          <p className="text-primary text-sm font-bold mb-1">{incident.title}</p>
          <p className="text-secondary text-xs">{incident.description}</p>
          <div className="flex gap-2 mt-2 text-[10px] text-muted">
            <span>خط: {incident.lineName}</span>
            <span>ماشین: {incident.machineName}</span>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <h3 className="text-primary text-sm font-bold">چک‌لیست اجباری</h3>
          {checklist.map((item) => (
            <div key={item.id} className={`bg-card rounded-xl p-3 border ${item.completed ? 'border-green-500/20' : 'border-default'}`}>
              {item.type === 'checkbox' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={item.completed} onChange={() => handleCheck(item.id)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-green-500 focus:ring-0 cursor-pointer" />
                  <div>
                    <p className={`text-sm ${item.completed ? 'text-green-400 line-through' : 'text-primary'}`}>{item.text}</p>
                    {item.completed && <p className="text-[10px] text-green-500/70">✓ انجام شد</p>}
                  </div>
                </label>
              )}
              {item.type === 'text' && (
                <div>
                  <p className="text-sm text-primary mb-1.5">{item.text}</p>
                  <textarea value={item.value} onChange={(e) => handleText(item.id, e.target.value)}
                    className="w-full bg-card border border-default rounded-lg p-2 text-primary text-xs h-20 resize-none focus:outline-none focus:border-blue-500"
                    placeholder="توضیح علت خرابی..." />
                </div>
              )}
              {item.type === 'photo' && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-primary">{item.text}</p>
                  <button onClick={() => handlePhoto(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${item.completed ? 'bg-green-500/10 text-green-400' : 'bg-card text-primary border border-default'}`}>
                    <Camera size={14} />
                    {item.completed ? 'ثبت شد' : 'دوربین'}
                  </button>
                </div>
              )}
              {item.type === 'signature' && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-primary">{item.text}</p>
                  <button onClick={() => handleCheck(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs ${item.completed ? 'bg-green-500/10 text-green-400' : 'bg-card text-primary border border-default'}`}>
                    {item.completed ? 'امضا شد' : 'امضا'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {needsSupervisor && (
          <div className="mb-5">
            {!showApprovalInput ? (
              <button onClick={() => setShowApprovalInput(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-amber-600/50 text-amber-400 text-sm hover:bg-amber-500/5">
                تأیید سرپرست
              </button>
            ) : (
              <div className="bg-card rounded-xl p-3 border border-amber-500/20">
                <p className="text-primary text-xs mb-2">کد تأیید سرپرست را وارد کنید:</p>
                <div className="flex gap-2">
                  <input value={approvalCode} onChange={(e) => setApprovalCode(e.target.value)}
                    className="flex-1 bg-card border border-default rounded-lg px-3 py-2 text-primary text-xs text-center font-mono tracking-widest focus:outline-none focus:border-amber-500"
                    placeholder="_ _ _ _ _ _" maxLength={6} />
                  <button disabled={approvalCode.length < 4}
                    onClick={() => { if (approvalCode === '123456') { setSupervisorApproved(true); } }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 rounded-lg text-white text-xs font-medium">
                    تأیید
                  </button>
                </div>
                {supervisorApproved && <p className="text-green-400 text-xs mt-1">✓ تأیید شد</p>}
              </div>
            )}
          </div>
        )}

        <button disabled={!allRequiredDone || (needsSupervisor && !supervisorApproved)}
          onClick={onComplete}
          className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-muted text-primary transition-colors">
          تکمیل و رفع قفل
        </button>
        <p className="text-muted text-[10px] text-center mt-2">
          تمام موارد اجباری باید تکمیل شوند
        </p>
      </div>
    </div>
  );
}

function MESDashboard() {
  const totalToday = productionLines.reduce((s, l) => s + l.todayProduction, 0);
  const totalTarget = productionLines.reduce((s, l) => s + l.todayTarget, 0);
  const avgOEE = oeeCalculations.reduce((s, o) => s + o.oee, 0) / oeeCalculations.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">مرکز تولید (MES)</h1>
          <p className="text-muted">سیستم اجرای تولید — مانیتورینگ و کنترل کامل خطوط</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500 text-xs font-medium">لایو</span>
          </div>
        </div>
      </div>

      <StatGrid columns={4}>
        <StatCard title="تولید امروز" value={totalToday.toLocaleString()} unit="قطعه" change={`هدف: ${totalTarget.toLocaleString()}`} changeType={totalToday >= totalTarget ? 'up' : 'down'} icon={<Factory size={22} />} color="#10b981" />
        <StatCard title="OEE میانگین" value={`${avgOEE.toFixed(1)}%`} change="+۲.۱٪ نسبت به دیروز" changeType="up" icon={<Gauge size={22} />} color="#3b82f6" />
        <StatCard title="خطوط فعال" value={`${productionLines.filter(l => l.status === 'running').length}/${productionLines.length}`} icon={<Play size={22} />} color="#22c55e" />
        <StatCard title="توقف امروز" value={`${downtimeRecords.reduce((s, d) => s + (d.duration || 0), 0)}`} unit="دقیقه" changeType="down" icon={<Clock size={22} />} color="#ef4444" />
      </StatGrid>

      {/* Production Lines Status */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {productionLines.map((line) => (
          <div key={line.id} className={`bg-card border rounded-2xl p-4 ${line.status === 'running' ? 'border-green-500/30' : line.status === 'maintenance' ? 'border-amber-500/30' : 'border-red-500/30'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-primary font-bold text-sm">{line.name}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[line.status]}`}>
                {statusLabels[line.status]}
              </span>
            </div>

            {/* OEE Ring */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={line.status === 'running' ? '#3b82f6' : '#6b7280'} strokeWidth="3"
                    strokeDasharray={`${line.oee} ${100 - line.oee}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary font-black text-sm">{line.oee}%</span>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between gap-3"><span className="text-muted">A</span><span className="text-primary">{line.availability}%</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted">P</span><span className="text-primary">{line.performance}%</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted">Q</span><span className="text-primary">{line.quality}%</span></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted">تولید امروز</span>
                <span className="text-primary">{line.todayProduction.toLocaleString()} / {line.todayTarget.toLocaleString()}</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (line.todayProduction / line.todayTarget) * 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-default rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500" /> تولید خطوط (ساعتی)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={phase2ChartData.lineProductionToday}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="hour" tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="L1" fill="#3b82f6" radius={[4, 4, 0, 0]} name="خط ۱" />
              <Bar dataKey="L2" fill="#10b981" radius={[4, 4, 0, 0]} name="خط ۲" />
              <Bar dataKey="L4" fill="#f59e0b" radius={[4, 4, 0, 0]} name="خط ۴" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-default rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-red-500" /> علل توقفات
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={phase2ChartData.downtimeByCategory} cx="50%" cy="50%" outerRadius={70} innerRadius={45} dataKey="value" stroke="none">
                  {phase2ChartData.downtimeByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {phase2ChartData.downtimeByCategory.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-secondary">{item.name}</span>
                  </div>
                  <span className="text-primary">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductionOrdersPage() {
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState<ProductionOrder[]>(productionOrders);

  const columns: Column<ProductionOrder>[] = [
    { key: 'orderNumber', title: 'شماره سفارش', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'productName', title: 'محصول', render: (v, row) => (
      <div><p className="text-primary">{v}</p><p className="text-muted text-xs">{row.productCode}</p></div>
    )},
    { key: 'quantity', title: 'تعداد', render: (v) => v.toLocaleString() },
    { key: 'completedQty', title: 'تولید شده', render: (v) => v.toLocaleString() },
    { key: 'rejectedQty', title: 'ضایعات' },
    { key: 'lineName', title: 'خط' },
    { key: 'priority', title: 'اولویت', render: (v) => {
      const p: Record<string, string> = { critical: 'bg-red-500/10 text-red-500', high: 'bg-orange-500/10 text-orange-500', medium: 'bg-amber-500/10 text-amber-500', low: 'bg-blue-500/10 text-blue-500' };
      const l: Record<string, string> = { critical: 'بحرانی', high: 'بالا', medium: 'متوسط', low: 'پایین' };
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${p[v]}`}>{l[v]}</span>;
    }},
    { key: 'progress', title: 'پیشرفت', render: (v) => (
      <div className="flex items-center gap-2 min-w-[80px]">
        <div className="flex-1 bg-zinc-700 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${v >= 100 ? 'bg-green-500' : v > 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs text-secondary w-8">{v}%</span>
      </div>
    )},
    { key: 'status', title: 'وضعیت', render: (v) => <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[v]}`}>{statusLabels[v]}</span> },
    { key: 'plannedEnd', title: 'مهلت' },
  ];

  const formFields: FormField[] = [
    { name: 'orderNumber', label: 'شماره سفارش', type: 'text', required: true },
    { name: 'productName', label: 'محصول', type: 'text', required: true },
    { name: 'quantity', label: 'تعداد', type: 'number', required: true },
    { name: 'unit', label: 'واحد', type: 'select', options: [{ value: 'عدد', label: 'عدد' }, { value: 'کیلوگرم', label: 'کیلوگرم' }, { value: 'متر', label: 'متر' }] },
    { name: 'lineId', label: 'خط تولید', type: 'select', required: true, options: [
      { value: 'L-001', label: 'خط ۱ - آلومینیوم' }, { value: 'L-002', label: 'خط ۲ - فولاد' },
      { value: 'L-003', label: 'خط ۳ - پلیمر' }, { value: 'L-004', label: 'خط ۴ - تجمیع' },
    ]},
    { name: 'priority', label: 'اولویت', type: 'select', options: [
      { value: 'critical', label: 'بحرانی' }, { value: 'high', label: 'بالا' },
      { value: 'medium', label: 'متوسط' }, { value: 'low', label: 'پایین' },
    ]},
    { name: 'plannedStart', label: 'شروع برنامه‌ریزی', type: 'date', required: true },
    { name: 'plannedEnd', label: 'پایان برنامه‌ریزی', type: 'date', required: true },
    { name: 'customerName', label: 'مشتری', type: 'text' },
    { name: 'notes', label: 'یادداشت', type: 'textarea', colSpan: 2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={orders} columns={columns} title="سفارشات تولید"
        icon={<Factory size={18} className="text-green-500" />}
        onAdd={() => setShowModal(true)} onEdit={() => setShowModal(true)} addLabel="سفارش جدید" selectable />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { setOrders(prev => [...prev, { id: uid(), ...data } as any]); setShowModal(false); }}
        title="سفارش تولید جدید" fields={formFields} size="lg" />
    </div>
  );
}

function OEEPage() {
  const [showModal, setShowModal] = useState(false);
  const [calculations, setCalculations] = useState(oeeCalculations.map(c => ({ ...c, id: uid('OEE-') })));

  const oeeColumns: Column<OEECalculation & { id: string }>[] = [
    { key: 'lineName', title: 'خط تولید' },
    { key: 'availability', title: 'دسترسی (A)', render: (v) => `${v.toFixed(1)}%` },
    { key: 'performance', title: 'عملکرد (P)', render: (v) => `${v.toFixed(1)}%` },
    { key: 'qualityRate', title: 'کیفیت (Q)', render: (v) => `${v.toFixed(1)}%` },
    { key: 'oee', title: 'OEE', render: (v) => <span className={`font-bold ${v >= 85 ? 'text-green-400' : v >= 65 ? 'text-amber-400' : 'text-red-400'}`}>{v.toFixed(1)}%</span> },
    { key: 'date', title: 'تاریخ' },
  ];

  const oeeFormFields: FormField[] = [
    { name: 'lineName', label: 'خط تولید', type: 'select', required: true, options: [
      { value: 'خط ۱ - آلومینیوم', label: 'خط ۱ - آلومینیوم' },
      { value: 'خط ۲ - فولاد', label: 'خط ۲ - فولاد' },
      { value: 'خط ۴ - تجمیع', label: 'خط ۴ - تجمیع' },
    ]},
    { name: 'date', label: 'تاریخ', type: 'date', required: true },
    { name: 'plannedTime', label: 'زمان برنامه‌ریزی (دقیقه)', type: 'number', required: true },
    { name: 'downtime', label: 'توقف (دقیقه)', type: 'number', required: true },
    { name: 'totalParts', label: 'کل قطعات', type: 'number', required: true },
    { name: 'goodParts', label: 'قطعات سالم', type: 'number', required: true },
    { name: 'idealCycleTime', label: 'زمان سیکل ایده‌آل (ثانیه)', type: 'number', required: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">موتور OEE</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {oeeCalculations.map((calc) => (
          <div key={calc.lineId} className="bg-card border border-default rounded-2xl p-5">
            <h3 className="text-primary font-bold mb-4">{calc.lineName}</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-card rounded-xl p-3">
                <p className="text-2xl font-black text-blue-400">{calc.availability.toFixed(1)}%</p>
                <p className="text-muted text-xs">دسترسی (A)</p>
                <p className="text-muted text-[10px]">{calc.availableTime}/{calc.plannedTime} دقیقه</p>
              </div>
              <div className="bg-card rounded-xl p-3">
                <p className="text-2xl font-black text-green-400">{calc.performance.toFixed(1)}%</p>
                <p className="text-muted text-xs">عملکرد (P)</p>
                <p className="text-muted text-[10px]">{calc.totalParts.toLocaleString()} قطعه</p>
              </div>
              <div className="bg-card rounded-xl p-3">
                <p className="text-2xl font-black text-amber-400">{calc.qualityRate.toFixed(1)}%</p>
                <p className="text-muted text-xs">کیفیت (Q)</p>
                <p className="text-muted text-[10px]">{calc.goodParts.toLocaleString()} قطعه سالم</p>
              </div>
              <div className="bg-card rounded-xl p-3">
                <p className="text-2xl font-black text-primary">{calc.oee.toFixed(1)}%</p>
                <p className="text-muted text-xs">OEE</p>
                <p className={`text-[10px] ${calc.oee >= 85 ? 'text-green-500' : calc.oee >= 65 ? 'text-amber-500' : 'text-red-500'}`}>
                  {calc.oee >= 85 ? '✓ عالی' : calc.oee >= 65 ? '~ قابل قبول' : '✗ نیاز بهبود'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DataTable data={calculations} columns={oeeColumns} title="محاسبات OEE"
        icon={<Gauge size={18} className="text-blue-500" />}
        onAdd={() => setShowModal(true)} addLabel="محاسبه OEE جدید" />

      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { setCalculations(prev => [...prev, { id: uid('OEE-'), ...data, availableTime: 0, availability: 0, performance: 0, qualityRate: 0, oee: 0 } as any]); setShowModal(false); }}
        title="محاسبه جدید OEE" fields={oeeFormFields} size="lg" />

      <div className="bg-card border border-default rounded-2xl p-5">
        <h3 className="text-primary font-bold mb-4">روند OEE خطوط</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={phase2ChartData.oeeHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} domain={[50, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            <Line type="monotone" dataKey="L1" stroke="#3b82f6" strokeWidth={2} name="خط ۱" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="L2" stroke="#10b981" strokeWidth={2} name="خط ۲" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="L4" stroke="#f59e0b" strokeWidth={2} name="خط ۴" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DowntimePage() {
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState<DowntimeRecord[]>(downtimeRecords);

  const columns: Column<DowntimeRecord>[] = [
    { key: 'id', title: 'شناسه', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'lineName', title: 'خط' },
    { key: 'machineName', title: 'ماشین' },
    { key: 'reason', title: 'دلیل' },
    { key: 'category', title: 'دسته', render: (v) => {
      const cats: Record<string, string> = { mechanical: 'مکانیکی', electrical: 'الکتریکی', material: 'مواد', operator: 'اپراتور', quality: 'کیفیت', utility: 'یوتیلیتی', planned: 'برنامه‌ریزی' };
      const colors: Record<string, string> = { mechanical: 'bg-red-500/10 text-red-500', electrical: 'bg-amber-500/10 text-amber-500', planned: 'bg-blue-500/10 text-blue-500' };
      return <span className={`px-2 py-0.5 rounded text-xs ${colors[v] || 'bg-zinc-500/10 text-zinc-400'}`}>{cats[v] || v}</span>;
    }},
    { key: 'startTime', title: 'شروع' },
    { key: 'duration', title: 'مدت (دقیقه)', render: (v) => v ? <span className="font-bold text-red-400">{v}</span> : <span className="text-amber-500 animate-pulse">جاری...</span> },
    { key: 'cost', title: 'هزینه (ریال)', render: (v) => v ? v.toLocaleString() : '-' },
    { key: 'approved', title: 'تأیید', render: (v) => v ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-amber-500" /> },
  ];

  const formFields: FormField[] = [
    { name: 'lineName', label: 'خط تولید', type: 'select', required: true, options: [
      { value: 'خط ۱ - آلومینیوم', label: 'خط ۱ - آلومینیوم' },
      { value: 'خط ۲ - فولاد', label: 'خط ۲ - فولاد' },
      { value: 'خط ۳ - پلیمر', label: 'خط ۳ - پلیمر' },
      { value: 'خط ۴ - تجمیع', label: 'خط ۴ - تجمیع' },
    ]},
    { name: 'machineName', label: 'ماشین', type: 'text' },
    { name: 'reason', label: 'دلیل توقف', type: 'text', required: true },
    { name: 'category', label: 'دسته', type: 'select', required: true, options: [
      { value: 'mechanical', label: 'مکانیکی' },
      { value: 'electrical', label: 'الکتریکی' },
      { value: 'material', label: 'مواد' },
      { value: 'operator', label: 'اپراتور' },
      { value: 'quality', label: 'کیفیت' },
      { value: 'utility', label: 'یوتیلیتی' },
      { value: 'planned', label: 'برنامه‌ریزی' },
    ]},
    { name: 'startTime', label: 'زمان شروع', type: 'text', required: true },
    { name: 'endTime', label: 'زمان پایان', type: 'text' },
    { name: 'duration', label: 'مدت (دقیقه)', type: 'number' },
    { name: 'operatorName', label: 'اپراتور', type: 'text', required: true },
    { name: 'note', label: 'یادداشت', type: 'textarea', colSpan: 2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <StatGrid columns={4}>
        <StatCard title="توقف امروز" value={`${records.reduce((s, d) => s + (d.duration || 0), 0)}`} unit="دقیقه" icon={<Clock size={22} />} color="#ef4444" />
        <StatCard title="تعداد توقف" value={records.length} icon={<TriangleAlert size={22} />} color="#f59e0b" />
        <StatCard title="هزینه توقفات" value={`${(records.reduce((s, d) => s + (d.cost || 0), 0) / 1000000).toFixed(0)}M`} unit="ریال" icon={<TrendingDown size={22} />} color="#ef4444" />
        <StatCard title="توقف جاری" value={records.filter(d => !d.endTime).length} icon={<Square size={22} />} color="#f97316" />
      </StatGrid>
      <DataTable data={records} columns={columns} title="ثبت توقفات"
        icon={<Clock size={18} className="text-red-500" />}
        onAdd={() => setShowModal(true)} addLabel="ثبت توقف جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { setRecords(prev => [...prev, { id: uid('DT-'), ...data, approved: false, lineId: data.lineName }]); setShowModal(false); }}
        title="ثبت توقف جدید" fields={formFields} size="lg" />
    </div>
  );
}

function ScrapPage() {
  const [showModal, setShowModal] = useState(false);
  const [scraps, setScraps] = useState<ScrapRecord[]>(scrapRecords);

  const columns: Column<ScrapRecord>[] = [
    { key: 'id', title: 'شناسه', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'productName', title: 'محصول' },
    { key: 'scrapType', title: 'نوع ضایعات' },
    { key: 'quantity', title: 'تعداد' },
    { key: 'unit', title: 'واحد' },
    { key: 'reason', title: 'علت' },
    { key: 'cost', title: 'هزینه', render: (v) => v.toLocaleString() },
  ];

  const formFields: FormField[] = [
    { name: 'productName', label: 'محصول', type: 'text', required: true },
    { name: 'scrapType', label: 'نوع ضایعات', type: 'text', required: true },
    { name: 'quantity', label: 'تعداد', type: 'number', required: true },
    { name: 'unit', label: 'واحد', type: 'select', options: [
      { value: 'عدد', label: 'عدد' },
      { value: 'کیلوگرم', label: 'کیلوگرم' },
      { value: 'متر', label: 'متر' },
    ]},
    { name: 'reason', label: 'علت', type: 'text', required: true },
    { name: 'cost', label: 'هزینه (ریال)', type: 'number', required: true },
    { name: 'operatorName', label: 'اپراتور', type: 'text', required: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">مدیریت ضایعات</h1>
      <StatGrid columns={3}>
        <StatCard title="ضایعات امروز" value={scraps.reduce((s, r) => s + r.quantity, 0)} unit="عدد" icon={<XCircle size={22} />} color="#ef4444" />
        <StatCard title="هزینه ضایعات" value={`${(scraps.reduce((s, r) => s + r.cost, 0) / 1000000).toFixed(0)}M`} unit="ریال" icon={<TrendingDown size={22} />} color="#f97316" />
        <StatCard title="نرخ ضایعات" value="۱.۸" unit="%" icon={<BarChart3 size={22} />} color="#f59e0b" />
      </StatGrid>
      <DataTable data={scraps} columns={columns} title="ضایعات ثبت شده"
        icon={<XCircle size={18} className="text-red-500" />}
        onAdd={() => setShowModal(true)} addLabel="ثبت ضایعات" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { setScraps(prev => [...prev, { id: uid('SC-'), ...data, orderId: '', lineId: '', recordedAt: new Date().toISOString() } as any]); setShowModal(false); }}
        title="ثبت ضایعات جدید" fields={formFields} size="lg" />
    </div>
  );
}

function ShiftsPage() {
  const [showModal, setShowModal] = useState(false);
  const [shiftList, setShiftList] = useState<Shift[]>(shifts);

  const columns: Column<Shift>[] = [
    { key: 'name', title: 'نام شیفت' },
    { key: 'startTime', title: 'شروع' },
    { key: 'endTime', title: 'پایان' },
    { key: 'breakMinutes', title: 'استراحت', render: (v) => `${v} دقیقه` },
    { key: 'targetQty', title: 'هدف', render: (v) => v.toLocaleString() },
    { key: 'actualQty', title: 'واقعی', render: (v) => v.toLocaleString() },
    { key: 'status', title: 'وضعیت', render: (v) => <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[v]}`}>{statusLabels[v]}</span> },
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'نام شیفت', type: 'text', required: true },
    { name: 'startTime', label: 'زمان شروع', type: 'time', required: true },
    { name: 'endTime', label: 'زمان پایان', type: 'time', required: true },
    { name: 'breakMinutes', label: 'استراحت (دقیقه)', type: 'number' },
    { name: 'lineId', label: 'خط تولید', type: 'select', required: true, options: [
      { value: 'L-001', label: 'خط ۱ - آلومینیوم' },
      { value: 'L-002', label: 'خط ۲ - فولاد' },
      { value: 'L-003', label: 'خط ۳ - پلیمر' },
      { value: 'L-004', label: 'خط ۴ - تجمیع' },
    ]},
    { name: 'date', label: 'تاریخ', type: 'date', required: true },
    { name: 'targetQty', label: 'هدف', type: 'number', required: true },
    { name: 'status', label: 'وضعیت', type: 'select', options: [
      { value: 'planned', label: 'برنامه‌ریزی' },
      { value: 'active', label: 'فعال' },
      { value: 'completed', label: 'تکمیل' },
    ]},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">مدیریت شیفت‌ها</h1>
      <DataTable data={shiftList} columns={columns} title="شیفت‌ها"
        icon={<Clock size={18} className="text-amber-500" />}
        onAdd={() => setShowModal(true)} addLabel="شیفت جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { setShiftList(prev => [...prev, { id: uid('SHF-'), ...data, code: '', supervisorId: '', supervisorName: '', operatorIds: [], actualQty: 0 } as any]); setShowModal(false); }}
        title="شیفت جدید" fields={formFields} size="lg" />
    </div>
  );
}

function ProductionEntryPage() {
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState<ProductionEntry[]>([]);

  const columns: Column<ProductionEntry>[] = [
    { key: 'id', title: 'شناسه', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'orderId', title: 'سفارش' },
    { key: 'operatorName', title: 'اپراتور' },
    { key: 'producedQty', title: 'تولید شده', render: (v) => v.toLocaleString() },
    { key: 'rejectedQty', title: 'ضایعات' },
    { key: 'reworkQty', title: 'دوباره‌کاری' },
    { key: 'downtime', title: 'توقف', render: (v) => `${v} دقیقه` },
    { key: 'entryTime', title: 'زمان ثبت' },
  ];

  const formFields: FormField[] = [
    { name: 'orderId', label: 'سفارش تولید', type: 'select', required: true, options: productionOrders.map(o => ({ value: o.id, label: `${o.orderNumber} - ${o.productName}` })) },
    { name: 'lineId', label: 'خط تولید', type: 'select', required: true, options: [
      { value: 'L-001', label: 'خط ۱ - آلومینیوم' },
      { value: 'L-002', label: 'خط ۲ - فولاد' },
      { value: 'L-003', label: 'خط ۳ - پلیمر' },
      { value: 'L-004', label: 'خط ۴ - تجمیع' },
    ]},
    { name: 'operatorName', label: 'اپراتور', type: 'text', required: true },
    { name: 'producedQty', label: 'تعداد تولید شده', type: 'number', required: true },
    { name: 'rejectedQty', label: 'ضایعات', type: 'number' },
    { name: 'reworkQty', label: 'دوباره‌کاری', type: 'number' },
    { name: 'downtime', label: 'توقف (دقیقه)', type: 'number' },
    { name: 'comments', label: 'توضیحات', type: 'textarea', colSpan: 2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">ثبت تولید</h1>
      <DataTable data={entries} columns={columns} title="ورودی‌های تولید"
        icon={<CheckCircle2 size={18} className="text-green-500" />}
        onAdd={() => setShowModal(true)} addLabel="ثبت تولید جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { setEntries(prev => [...prev, { id: uid('ENT-'), ...data, shiftId: '', entryTime: new Date().toLocaleString('fa') } as any]); setShowModal(false); }}
        title="ثبت تولید جدید" fields={formFields} size="lg" />
    </div>
  );
}

function LinesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">خطوط تولید</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {productionLines.map((line) => (
          <div key={line.id} className="bg-card border border-default rounded-2xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-primary font-bold">{line.name}</h3>
                <span className="text-xs text-muted font-mono">{line.code}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[line.status]}`}>{statusLabels[line.status]}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-muted text-xs">ظرفیت</p><p className="text-primary font-bold">{line.capacity} {line.capacityUnit}</p></div>
              <div><p className="text-muted text-xs">OEE</p><p className={`font-bold ${line.oee >= 85 ? 'text-green-400' : line.oee >= 65 ? 'text-amber-400' : 'text-red-400'}`}>{line.oee}%</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==============================
   LIVE MONITORING PAGE
   ============================== */
function LiveMonitoringPage() {
  const token = useAuthStore(s => s.token);
  const [live, setLive] = useState<any>(null);
  const sensorTagsAll = live ? (live.tags || []).map((t: any) => ({ ...t, tagType: t.id?.startsWith('TEMP') ? 'temperature' : 'rpm', quality: 'good' })) : tags.filter(t => ['temperature','pressure','rpm','current','counter','status','voltage'].includes(t.tagType));
  const activeAlertsAll = live ? (live.alerts || []) : alerts.filter(a => a.status === 'active');
  const linesAll = live ? (live.lines || []) : productionLines;
  const runningLines = linesAll.filter((l: any) => l.status === 'running');
  const chartData = (() => {
    if (!live?.tagHistory) return phase2ChartData.tagTrend;
    return live.tagHistory.slice(-20).map((d: any) => ({ time: new Date(d.ts).toLocaleTimeString('fa'), temp: d.temp, pressure: d.pressure, rpm: d.rpm }));
  })();

  useEffect(() => {
    if (!token) return;
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/monitoring/live', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const d = await res.json(); setLive(d); }
      } catch {}
    };
    fetchLive();
    const interval = setInterval(fetchLive, 5000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">مانیتورینگ زنده خطوط</h1>
          <p className="text-muted">داده‌های لحظه‌ای سنسورها، هشدارها و وضعیت خطوط</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500 text-xs font-medium">آنلاین</span>
          </div>
        </div>
      </div>

      <StatGrid columns={4}>
        <StatCard title="خطوط فعال" value={`${runningLines.length}/${linesAll.length}`} icon={<Activity size={22} />} color="#22c55e" />
        <StatCard title="سنسورهای متصل" value={sensorTagsAll.filter((t: any) => t.quality === 'good').length} unit={`از ${sensorTagsAll.length}`} icon={<Cpu size={22} />} color="#3b82f6" />
        <StatCard title="هشدارهای فعال" value={activeAlertsAll.length} unit="عدد" icon={<Bell size={22} />} color="#ef4444" />
        <StatCard title="فرمول‌های محاسبه" value={formulas.length} unit="KPI" icon={<BarChart3 size={22} />} color="#a855f7" />
      </StatGrid>

      {/* Line Status Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {linesAll.map((line: any) => {
          const lineTags = sensorTagsAll.filter((t: any) => t.deviceName === `PLC ${line.name.slice(0, 4)}`);
          return (
            <div key={line.id} className={`bg-card border rounded-2xl p-4 ${line.status === 'running' ? 'border-green-500/30' : line.status === 'maintenance' ? 'border-amber-500/30' : 'border-red-500/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-primary font-bold text-sm">{line.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[line.status]}`}>{statusLabels[line.status]}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                <div className="text-[10px] text-muted">تولید:</div>
                <div className="text-[10px] text-primary text-left">{line.todayProduction.toLocaleString()} / {line.todayTarget.toLocaleString()}</div>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-1.5 mb-2">
                <div className={`h-1.5 rounded-full ${line.todayProduction >= line.todayTarget ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, (line.todayProduction / line.todayTarget) * 100)}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="bg-card rounded-lg p-1.5">
                  <p className="text-blue-400 font-bold text-xs">{line.availability}%</p>
                  <p className="text-muted text-[9px]">A</p>
                </div>
                <div className="bg-card rounded-lg p-1.5">
                  <p className="text-green-400 font-bold text-xs">{line.performance}%</p>
                  <p className="text-muted text-[9px]">P</p>
                </div>
                <div className="bg-card rounded-lg p-1.5">
                  <p className="text-amber-400 font-bold text-xs">{line.quality}%</p>
                  <p className="text-muted text-[9px]">Q</p>
                </div>
              </div>
              {/* Sensor snapshot */}
              <div className="mt-2 space-y-0.5">
                {lineTags.slice(0, 3).map(tag => (
                  <div key={tag.id} className="flex justify-between text-[9px]">
                    <span className="text-muted">{tag.name}</span>
                    <span className={`font-mono ${tag.alarmEnabled && tag.alarmHigh && tag.currentValue >= tag.alarmHigh ? 'text-red-400' : 'text-primary'}`}>
                      {typeof tag.currentValue === 'number' ? tag.currentValue.toFixed(1) : tag.currentValue} {tag.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sensor Trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-default rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" /> روند سنسورهای خط ۱
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="temp" stroke="#ef4444" fill="#ef444410" name="دما (°C)" />
              <Area type="monotone" dataKey="pressure" stroke="#3b82f6" fill="#3b82f610" name="فشار (bar)" />
              <Area type="monotone" dataKey="rpm" stroke="#10b981" fill="#10b98110" name="RPM" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-default rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
            <Bell size={16} className="text-red-500" /> هشدارهای فعال
          </h3>
          <div className="space-y-2 max-h-[240px] overflow-y-auto">
            {activeAlertsAll.length === 0 && <p className="text-muted text-sm text-center py-8">هیچ هشدار فعالی وجود ندارد</p>}
            {activeAlertsAll.map((alert: any) => (
              <div key={alert.id} className="bg-card rounded-xl p-3 border border-default hover:border-default transition-colors">
                <div className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${alert.severity === 'critical' ? 'bg-red-500/20' : alert.severity === 'major' ? 'bg-orange-500/20' : 'bg-amber-500/20'}`}>
                    <TriangleAlert size={12} className={alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'major' ? 'text-orange-500' : 'text-amber-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-primary text-xs font-bold">{alert.title}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${alert.severity === 'critical' ? 'bg-red-500/10 text-red-400' : alert.severity === 'major' ? 'bg-orange-500/10 text-orange-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {alert.severity === 'critical' ? 'بحرانی' : alert.severity === 'major' ? 'ماژور' : 'هشدار'}
                      </span>
                    </div>
                    <p className="text-secondary text-[10px] mt-0.5">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-muted">
                      <span>{alert.departmentName || alert.source || '—'}</span>
                      <span>{alert.openedAt || alert.createdAt || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formula KPI Cards */}
      <div className="bg-card border border-default rounded-2xl p-5">
        <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-purple-500" /> شاخص‌های محاسباتی (فرمول‌ها)
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {formulas.map((f) => (
            <div key={f.id} className="bg-card rounded-xl p-4 border border-default">
              <p className="text-primary text-sm font-bold">{f.name}</p>
              <p className="text-muted text-[10px] mb-2">{f.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-purple-400">{f.lastValue.toLocaleString()}</span>
                <span className="text-muted text-xs">{f.unit}</span>
              </div>
              <p className="text-muted text-[9px] mt-1">آخرین محاسبه: {f.lastCalculated}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==============================
   LINE INCIDENTS PAGE
   ============================== */
function LineIncidentsPage() {
  const screenLockedIncident = incidents.find(i => i.screenLocked && !i.checklistCompleted);
  const [localIncidents, setLocalIncidents] = useState<Incident[]>(incidents);
  const [showModal, setShowModal] = useState(false);

  const handleScreenLockComplete = () => {
    setLocalIncidents(prev => prev.map(i => i.id === screenLockedIncident?.id ? { ...i, screenLocked: false, checklistCompleted: true } : i));
  };

  const columns: Column<Incident>[] = [
    { key: 'code', title: 'کد', render: (v) => <span className="font-mono text-blue-400 text-xs">{v}</span> },
    { key: 'title', title: 'عنوان' },
    { key: 'lineName', title: 'خط' },
    { key: 'machineName', title: 'ماشین' },
    { key: 'severity', title: 'شدت', render: (v) => {
      const sv: Record<string, { label: string; color: string }> = { critical: { label: 'بحرانی', color: 'bg-red-500/10 text-red-500' }, high: { label: 'شدید', color: 'bg-orange-500/10 text-orange-500' }, medium: { label: 'متوسط', color: 'bg-amber-500/10 text-amber-500' }, low: { label: 'پایین', color: 'bg-blue-500/10 text-blue-500' } };
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${sv[v]?.color || 'bg-zinc-500/10 text-zinc-400'}`}>{sv[v]?.label || v}</span>;
    }},
    { key: 'status', title: 'وضعیت', render: (v) => {
      const st: Record<string, { label: string; color: string }> = { open: { label: 'باز', color: 'bg-red-500/10 text-red-500' }, investigating: { label: 'در حال بررسی', color: 'bg-amber-500/10 text-amber-500' }, resolved: { label: 'حل شده', color: 'bg-green-500/10 text-green-500' }, closed: { label: 'بسته', color: 'bg-zinc-500/10 text-zinc-400' } };
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${st[v]?.color || 'bg-zinc-500/10 text-zinc-400'}`}>{st[v]?.label || v}</span>;
    }},
    { key: 'reportedByName', title: 'گزارش‌دهنده' },
    { key: 'openedAt', title: 'زمان', render: (v) => <span className="text-xs text-secondary">{v}</span> },
    { key: 'screenLocked', title: 'قفل', render: (v) => v ? <Shield size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-green-500" /> },
  ];

  const formFields: FormField[] = [
    { name: 'title', label: 'عنوان حادثه', type: 'text', required: true },
    { name: 'lineName', label: 'خط تولید', type: 'select', required: true, options: productionLines.map(l => ({ value: l.name, label: l.name })) },
    { name: 'machineName', label: 'ماشین', type: 'text', required: true },
    { name: 'severity', label: 'شدت', type: 'select', required: true, options: [{ value: 'critical', label: 'بحرانی' }, { value: 'high', label: 'شدید' }, { value: 'medium', label: 'متوسط' }, { value: 'low', label: 'پایین' }] },
    { name: 'description', label: 'توضیحات', type: 'textarea', required: true, colSpan: 2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {screenLockedIncident && <ScreenLockOverlay incident={screenLockedIncident} onComplete={handleScreenLockComplete} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">حوادث خط تولید</h1>
          <p className="text-muted">ثبت و پیگیری حوادث، خرابی‌ها و توقفات اضطراری</p>
        </div>
        {screenLockedIncident && (
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 text-xs font-medium">قفل فعال</span>
          </div>
        )}
      </div>

      <StatGrid columns={4}>
        <StatCard title="کل حوادث" value={localIncidents.length} icon={<TriangleAlert size={22} />} color="#f97316" />
        <StatCard title="باز" value={localIncidents.filter(i => i.status === 'open' || i.status === 'investigating').length} icon={<TriangleAlert size={22} />} color="#ef4444" />
        <StatCard title="قفل شده" value={localIncidents.filter(i => i.screenLocked && !i.checklistCompleted).length} icon={<Shield size={22} />} color="#dc2626" />
        <StatCard title="هزینه کل" value={`${(localIncidents.reduce((s, i) => s + (i.cost || 0), 0) / 1000000).toFixed(0)}M`} unit="ریال" icon={<TrendingDown size={22} />} color="#f59e0b" />
      </StatGrid>

      <DataTable data={localIncidents} columns={columns} title="حوادث ثبت شده"
        icon={<TriangleAlert size={18} className="text-orange-500" />}
        onAdd={() => setShowModal(true)} addLabel="ثبت حادثه جدید" />

      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => {
          setLocalIncidents(prev => [{
            id: uid('INC-'), templateId: 'IT-001', code: `INC-${1403}-${String(prev.length + 1).padStart(3, '0')}`,
            description: data.description, severity: data.severity, status: 'open', source: 'maintenance',
            departmentId: 'D-006', departmentName: 'نگهداری', lineId: '',
            reportedBy: 'U-005', reportedByName: 'رضا حسینی', assignedTo: '', assignedToName: '',
            supervisorId: 'U-004', supervisorName: 'حسن موسوی', openedAt: new Date().toLocaleString('fa'),
            photos: [], checklist: [], screenLocked: false, checklistCompleted: false,
            actions: [], downtime: 0, cost: 0, ...data,
          } as any, ...prev]);
          setShowModal(false);
        }}
        title="ثبت حادثه جدید" fields={formFields} size="lg" />
    </div>
  );
}
