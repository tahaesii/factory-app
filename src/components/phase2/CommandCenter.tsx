import { useState } from 'react';
import { LayoutDashboard, Factory, Wrench, Shield, Users, DollarSign, Bell, TrendingUp, TrendingDown, Activity, Gauge, TriangleAlert, Bot, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import DataTable, { Column } from '@/components/ui/DataTable';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { uid } from '@/services/dataService';
import { factorySnapshot, executiveReports, phase2ChartData, productionLines } from '@/data/phase2Data';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ExecutiveReport } from '@/types/phase2';

const aiResponses: Record<string, string> = {
  'بزرگترین مشکل کارخانه چیست؟': '🔴 بزرگترین مشکل فعلی:\n\n1. **خط ۳ متوقف است** — پمپ هیدرولیک از کار افتاده، ۵۴۰ دقیقه توقف، هزینه تخمینی: ۸۵M ریال\n2. **OEE خط ۲ پایین** — ۶۲.۴٪ (هدف ۸۵٪) — توقف ۱۲۰ دقیقه به دلیل پرس هیدرولیک\n3. **موجودی بحرانی روغن** — ۳۰ لیتر موجود (حداقل ۱۰۰ لیتر)\n\n💡 اولویت: تعمیر فوری خط ۳ و خرید روغن هیدرولیک',
  'کدام خط ضررده است؟': '📊 تحلیل سودآوری خطوط:\n\n• خط ۳ — ❌ ضررده (متوقف، هزینه خرابی ۸۵M)\n• خط ۲ — ⚠️ کم‌سود (OEE 62.4٪ — زیر نقطه سربه‌سر)\n• خط ۱ — ✅ سودآور (OEE 85.2٪)\n• خط ۴ — ✅ سودآور (OEE 87.1٪)',
  'هزینه توقفات چقدر است؟': '💰 هزینه توقفات امروز:\n\n• خط ۳: ۸۵,۰۰۰,۰۰۰ ریال (پمپ هیدرولیک)\n• خط ۲: ۱۲,۵۰۰,۰۰۰ ریال (پرس هیدرولیک)\n• جمع کل توقفات: **۹۷,۵۰۰,۰۰۰ ریال**\n\n📉 نسبت به هفته گذشته: +۴۲٪',
  'چرا راندمان افت کرده؟': '📉 علل افت راندمان این هفته:\n\n1. خرابی پمپ هیدرولیک (خط ۳) — ۳۵٪ تأثیر\n2. تغییر قالب‌های برنامه‌ریزی نشده — ۲۵٪\n3. کمبود مواد اولیه (میلگرد) — ۱۵٪\n4. خرابی پرس هیدرولیک (خط ۲) — ۱۵٪\n\n💡 پیشنهاد: بهبود سیستم نت پیشگیرانه',
};

export function CommandCenterModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch (currentPage) {
    case 'executive': return <ExecutiveDashboard />;
    case 'live': return <LiveMonitoringPage />;
    case 'reports': return <ReportsPage />;
    case 'ai-assistant': return <AIAssistantPage />;
    default: return <ExecutiveDashboard />;
  }
}

function ExecutiveDashboard() {
  const snap = factorySnapshot;
  const [lastRefresh] = useState(new Date().toLocaleTimeString('fa'));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">اتاق فرمان</h1>
          <p className="text-zinc-500">نمای یکپارچه کل کارخانه — آخرین بروزرسانی: {lastRefresh}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500 text-xs">لایو</span>
          </div>
          <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl transition-all">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Factory size={18} className="text-green-500" />
            <span className="text-zinc-500 text-sm">تولید امروز</span>
          </div>
          <p className="text-3xl font-black text-white">{snap.production.totalOutput.toLocaleString()}</p>
          <p className="text-zinc-500 text-xs">از {snap.production.target.toLocaleString()} هدف</p>
          <div className="w-full bg-zinc-700 rounded-full h-1.5 mt-2">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(snap.production.totalOutput / snap.production.target) * 100}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gauge size={18} className="text-blue-500" />
            <span className="text-zinc-500 text-sm">OEE کارخانه</span>
          </div>
          <p className="text-3xl font-black text-white">{snap.production.oee}%</p>
          <div className={`flex items-center gap-1 text-xs mt-1 ${snap.production.oee >= 85 ? 'text-green-500' : 'text-amber-500'}`}>
            {snap.production.oee >= 85 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {snap.production.oee >= 85 ? '+۲.۱٪' : '-۳.۵٪'} نسبت به دیروز
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-amber-500" />
            <span className="text-zinc-500 text-sm">درآمد امروز</span>
          </div>
          <p className="text-3xl font-black text-white">۲.۱۵B</p>
          <p className="text-xs text-green-500 mt-1">سود: ۷۳۰M ریال</p>
        </div>

        <div className={`bg-zinc-900 border rounded-2xl p-4 ${snap.alerts.critical > 0 ? 'border-red-500/50' : 'border-zinc-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Bell size={18} className={snap.alerts.critical > 0 ? 'text-red-500 animate-pulse' : 'text-zinc-500'} />
            <span className="text-zinc-500 text-sm">هشدارها</span>
          </div>
          <p className={`text-3xl font-black ${snap.alerts.critical > 0 ? 'text-red-400' : 'text-white'}`}>{snap.alerts.active}</p>
          {snap.alerts.critical > 0 && <p className="text-red-500 text-xs mt-1 animate-pulse">⚠️ {snap.alerts.critical} بحرانی</p>}
        </div>
      </div>

      {/* Module Snapshots */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'تولید', icon: Factory, color: '#10b981', data: [
            { label: 'سفارش فعال', value: snap.production.activeOrders },
            { label: 'راندمان', value: `${snap.production.efficiency}%` },
            { label: 'توقف', value: `${snap.production.downtime}min`, bad: snap.production.downtime > 300 },
          ]},
          { title: 'نگهداری', icon: Wrench, color: '#ef4444', data: [
            { label: 'دستور کار', value: snap.maintenance.openWorkOrders, bad: snap.maintenance.openWorkOrders > 5 },
            { label: 'تجهیز خاموش', value: snap.maintenance.equipmentDown, bad: snap.maintenance.equipmentDown > 0 },
            { label: 'بحرانی', value: snap.maintenance.criticalWorkOrders, bad: snap.maintenance.criticalWorkOrders > 0 },
          ]},
          { title: 'کیفیت', icon: Shield, color: '#22c55e', data: [
            { label: 'نرخ عیب', value: `${snap.quality.defectRate}%`, bad: snap.quality.defectRate > 2 },
            { label: 'NCR باز', value: snap.quality.openNCRs },
            { label: 'Cpk', value: snap.quality.cpk },
          ]},
          { title: 'منابع انسانی', icon: Users, color: '#ec4899', data: [
            { label: 'حاضر', value: snap.hr.presentToday },
            { label: 'غایب', value: snap.hr.absent, bad: snap.hr.absent > 8 },
            { label: 'اضافه‌کاری', value: snap.hr.overtime },
          ]},
        ].map((module) => (
          <div key={module.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <module.icon size={18} style={{ color: module.color }} />
              <span className="text-white font-bold text-sm">{module.title}</span>
            </div>
            <div className="space-y-2">
              {module.data.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{item.label}</span>
                  <span className={typeof item.bad !== 'undefined' && item.bad ? 'text-red-400 font-bold' : 'text-white'}>{String(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Factory KPI Radar + Production Lines */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" /> رادار عملکرد کارخانه
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={phase2ChartData.factoryKPIs}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 9 }} />
              <Radar name="عملکرد" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Factory size={16} className="text-green-500" /> وضعیت خطوط تولید
          </h3>
          <div className="space-y-3">
            {productionLines.map((line) => {
              const pct = Math.min(100, (line.todayProduction / line.todayTarget) * 100);
              const statusColor = line.status === 'running' ? '#10b981' : line.status === 'maintenance' ? '#f59e0b' : '#ef4444';
              return (
                <div key={line.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
                      <span className="text-white">{line.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500">OEE: <span className="text-white">{line.oee}%</span></span>
                      <span className="text-zinc-500">{line.todayProduction.toLocaleString()} / {line.todayTarget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: statusColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Finance Snapshot */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-amber-500" /> خلاصه مالی امروز
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            { label: 'درآمد', value: (snap.finance.revenueToday / 1000000000).toFixed(2) + 'B', color: 'text-green-400' },
            { label: 'هزینه', value: (snap.finance.costToday / 1000000000).toFixed(2) + 'B', color: 'text-red-400' },
            { label: 'هزینه توقف', value: (snap.finance.downtimeCost / 1000000).toFixed(0) + 'M', color: 'text-orange-400' },
            { label: 'هزینه ضایعات', value: (snap.finance.scrapCost / 1000000).toFixed(0) + 'M', color: 'text-amber-400' },
          ].map((item) => (
            <div key={item.label} className="bg-zinc-800/50 rounded-xl p-4">
              <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{item.label} (ریال)</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveMonitoringPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">مانیتورینگ زنده</h1>
        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-500 text-xs">لایو</span>
        </div>
      </div>

      {/* Factory Map Placeholder */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1e3a5f20_0%,transparent_70%)]" />
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <LayoutDashboard size={16} className="text-blue-500" /> نقشه کارخانه
        </h3>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          {/* Buildings */}
          {[
            { name: 'سالن ۱', status: 'active', lines: ['خط ۱', 'خط ۲'], color: '#10b981' },
            { name: 'سالن ۲', status: 'warning', lines: ['خط ۳'], color: '#f59e0b' },
            { name: 'سالن ۳', status: 'active', lines: ['خط ۴'], color: '#10b981' },
          ].map((building) => (
            <div key={building.name} className={`border-2 rounded-2xl p-4 bg-zinc-800/30`} style={{ borderColor: building.color + '40' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: building.color }} />
                <h4 className="text-white font-bold">{building.name}</h4>
              </div>
              <div className="space-y-2">
                {building.lines.map((line) => (
                  <div key={line} className="bg-zinc-700/50 rounded-lg p-2 text-xs text-zinc-300">{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
          <div className="border border-zinc-700 rounded-2xl p-4 bg-zinc-800/30">
            <h4 className="text-white font-bold mb-2 text-sm">انبار مرکزی</h4>
            <p className="text-zinc-400 text-xs">۱,۲۴۸ قلم • ۳ موجودی بحرانی</p>
          </div>
          <div className="border border-zinc-700 rounded-2xl p-4 bg-zinc-800/30">
            <h4 className="text-white font-bold mb-2 text-sm">یوتیلیتی</h4>
            <p className="text-zinc-400 text-xs">کمپرسور: آنلاین • برق: ۲۸۷kWh</p>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <StatGrid columns={4}>
        <StatCard title="کارکنان حاضر" value={factorySnapshot.hr.presentToday} unit="نفر" icon={<Users size={22} />} color="#3b82f6" />
        <StatCard title="خطوط فعال" value={productionLines.filter(l => l.status === 'running').length} unit={`از ${productionLines.length}`} icon={<Factory size={22} />} color="#10b981" />
        <StatCard title="هشدار بحرانی" value={factorySnapshot.alerts.critical} icon={<TriangleAlert size={22} />} color="#ef4444" />
        <StatCard title="مصرف برق" value="۲۸۷" unit="kWh" icon={<Activity size={22} />} color="#f59e0b" />
      </StatGrid>
    </div>
  );
}

function ReportsPage() {
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState<ExecutiveReport[]>(executiveReports);
  const reportTypes = ['روزانه', 'هفتگی', 'ماهانه', 'فصلی', 'سالانه'];

  const columns: Column<ExecutiveReport>[] = [
    { key: 'title', title: 'عنوان گزارش' },
    { key: 'type', title: 'نوع', render: (v) => {
      const labels: Record<string, string> = { daily: 'روزانه', weekly: 'هفتگی', monthly: 'ماهانه', quarterly: 'فصلی', yearly: 'سالانه' };
      return labels[v] || v;
    }},
    { key: 'period', title: 'دوره' },
    { key: 'generatedAt', title: 'تولید شده' },
    { key: 'generatedBy', title: 'تولید کننده' },
    { key: 'status', title: 'وضعیت', render: (v) => (
      <span className={`text-xs px-2 py-0.5 rounded ${v === 'approved' ? 'bg-green-500/10 text-green-500' : v === 'sent' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-500/10 text-zinc-400'}`}>
        {v === 'approved' ? 'تأیید شده' : v === 'sent' ? 'ارسال شده' : 'پیش‌نویس'}
      </span>
    )},
    { key: 'sections', title: 'بخش‌ها', render: (v) => (
      <div className="flex gap-1">
        {(v as string[]).map((s) => <span key={s} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{s}</span>)}
      </div>
    )},
  ];

  const formFields: FormField[] = [
    { name: 'title', label: 'عنوان گزارش', type: 'text', required: true },
    { name: 'type', label: 'نوع', type: 'select', required: true, options: [
      { value: 'daily', label: 'روزانه' },
      { value: 'weekly', label: 'هفتگی' },
      { value: 'monthly', label: 'ماهانه' },
      { value: 'quarterly', label: 'فصلی' },
      { value: 'yearly', label: 'سالانه' },
    ]},
    { name: 'period', label: 'دوره', type: 'text', required: true },
    { name: 'generatedBy', label: 'تولید کننده', type: 'text', required: true },
    { name: 'status', label: 'وضعیت', type: 'select', options: [
      { value: 'draft', label: 'پیش‌نویس' },
      { value: 'sent', label: 'ارسال شده' },
      { value: 'approved', label: 'تأیید شده' },
    ]},
    { name: 'sections', label: 'بخش‌ها (هر خط یک بخش)', type: 'textarea', colSpan: 2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">گزارش‌های اجرایی</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        {reportTypes.map((type) => (
          <button key={type} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-sm transition-all">
            {type}
          </button>
        ))}
      </div>

      <DataTable data={reports} columns={columns} title="گزارش‌ها"
        icon={<Activity size={18} className="text-blue-500" />}
        onAdd={() => setShowModal(true)} addLabel="گزارش جدید" />

      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { setReports(prev => [...prev, { id: uid('RPT-'), ...data, sections: data.sections ? data.sections.split('\n').filter(Boolean) : [], generatedAt: new Date().toLocaleString('fa') } as any]); setShowModal(false); }}
        title="گزارش اجرایی جدید" fields={formFields} size="lg" />
    </div>
  );
}

function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'سلام! من دستیار هوش مصنوعی اتاق فرمان هستم. می‌توانم وضعیت لحظه‌ای کارخانه را تحلیل کرده و پیشنهاد دهم. سؤال خود را بپرسید.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = Object.keys(aiResponses);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const response = aiResponses[text] || `در حال تحلیل: "${text}"\n\nبر اساس داده‌های لحظه‌ای کارخانه، این موضوع نیاز به بررسی بیشتر دارد. پیشنهاد می‌کنم از داشبوردهای مرتبط استفاده کنید.`;
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Bot size={20} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-white font-bold">دستیار هوشمند اتاق فرمان</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-zinc-500">متصل به داده‌های زنده کارخانه</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex gap-1">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
              </div>
            </div>
          )}
        </div>
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => sendMessage(s)}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-3 py-1.5 rounded-full transition-all">
              {s}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-4">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="سؤال خود را بپرسید..." className="flex-1 bg-transparent outline-none text-sm text-white py-3" />
            <button onClick={() => sendMessage(input)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg">
              <TrendingUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
