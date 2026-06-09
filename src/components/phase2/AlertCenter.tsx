import { useState } from 'react';
import { Bell, TriangleAlert, CheckCircle2, XCircle, Clock, Zap, Phone, Mail, MessageSquare, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { alerts, alertTemplates, escalationRules, phase2ChartData } from '@/data/phase2Data';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Alert, AlertTemplate } from '@/types/phase2';

const severityConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  info:      { label: 'اطلاعاتی', color: '#6b7280', bg: 'bg-card/10 text-muted', icon: Activity },
  warning:   { label: 'هشدار',    color: '#3b82f6', bg: 'bg-blue-500/10 text-blue-500', icon: TriangleAlert },
  minor:     { label: 'مینور',    color: '#eab308', bg: 'bg-yellow-500/10 text-yellow-500', icon: TriangleAlert },
  major:     { label: 'ماژور',    color: '#f97316', bg: 'bg-orange-500/10 text-orange-500', icon: TriangleAlert },
  critical:  { label: 'بحرانی',   color: '#ef4444', bg: 'bg-red-500/10 text-red-500', icon: XCircle },
  emergency: { label: 'اضطراری',  color: '#7c3aed', bg: 'bg-purple-500/10 text-purple-500', icon: Zap },
};

const statusConfig: Record<string, { label: string; bg: string }> = {
  active:       { label: 'فعال',       bg: 'bg-red-500/10 text-red-500' },
  acknowledged: { label: 'تأیید شده',  bg: 'bg-amber-500/10 text-amber-500' },
  resolved:     { label: 'حل شده',     bg: 'bg-green-500/10 text-green-500' },
  closed:       { label: 'بسته',       bg: 'bg-card/10 text-muted' },
  escalated:    { label: 'اسکالیشن',   bg: 'bg-purple-500/10 text-purple-500' },
};

export function AlertCenterModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch (currentPage) {
    case 'active': return <ActiveAlertsPage />;
    case 'templates': return <TemplatesPage />;
    case 'escalation': return <EscalationPage />;
    case 'analytics': return <AlertAnalyticsPage />;
    case 'history': return <AlertHistoryPage />;
    default: return <AlertDashboard />;
  }
}

function AlertDashboard() {
  const active = alerts.filter(a => a.status === 'active').length;
  const critical = alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length;
  const acked = alerts.filter(a => a.status === 'acknowledged').length;
  const escalated = alerts.filter(a => a.escalationLevel > 1).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">مرکز هشدار (Alert Center)</h1>
          <p className="text-muted">مدیریت متمرکز تمام هشدارهای کارخانه</p>
        </div>
        <div className="flex items-center gap-2">
          {critical > 0 && (
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse">
              <XCircle size={14} className="text-red-500" />
              <span className="text-red-500 text-xs font-bold">{critical} هشدار بحرانی</span>
            </div>
          )}
        </div>
      </div>

      <StatGrid columns={4}>
        <StatCard title="هشدارهای فعال" value={active} icon={<Bell size={22} />} color="#ef4444" />
        <StatCard title="بحرانی" value={critical} icon={<XCircle size={22} />} color="#dc2626" />
        <StatCard title="تأیید شده" value={acked} icon={<CheckCircle2 size={22} />} color="#f59e0b" />
        <StatCard title="اسکالیشن" value={escalated} icon={<TrendingUp size={22} />} color="#8b5cf6" />
      </StatGrid>

      {/* Active Critical Alerts */}
      <div className="space-y-3">
        {alerts.filter(a => a.status === 'active' || a.status === 'acknowledged').map((alert) => {
          const sev = severityConfig[alert.severity];
          const SevIcon = sev.icon;
          return (
            <div key={alert.id} className={`bg-card border rounded-2xl p-4 ${alert.severity === 'critical' ? 'border-red-500/50' : alert.severity === 'major' ? 'border-orange-500/30' : 'border-default'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${sev.bg}`}>
                  <SevIcon size={18} style={{ color: sev.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${sev.bg}`}>{sev.label}</span>
                    <h3 className="text-primary font-bold">{alert.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusConfig[alert.status]?.bg}`}>{statusConfig[alert.status]?.label}</span>
                  </div>
                  <p className="text-secondary text-sm mt-1">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                    <span>🏭 {alert.departmentName}</span>
                    {alert.deviceName && <span>⚙️ {alert.deviceName}</span>}
                    <span>🕐 {alert.openedAt}</span>
                    {alert.escalationLevel > 0 && (
                      <span className="text-purple-400">⬆️ سطح {alert.escalationLevel}: {alert.escalatedTo}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {alert.status === 'active' && (
                    <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-lg transition-all">تأیید</button>
                  )}
                  {(alert.status === 'active' || alert.status === 'acknowledged') && (
                    <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-all">حل شد</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Severity Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border-default rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4">توزیع بر اساس شدت</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={phase2ChartData.alertsBySeverity} cx="50%" cy="50%" outerRadius={60} innerRadius={40} dataKey="value" stroke="none">
                  {phase2ChartData.alertsBySeverity.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {phase2ChartData.alertsBySeverity.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-secondary">{item.name}</span>
                  </div>
                  <span className="text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border-default rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4">کانال‌های اعلان</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'درون‌برنامه', icon: Bell, active: true, count: 12 },
              { name: 'پیامک', icon: Phone, active: true, count: 8 },
              { name: 'ایمیل', icon: Mail, active: true, count: 6 },
              { name: 'تلگرام', icon: MessageSquare, active: false, count: 0 },
              { name: 'واتساپ', icon: MessageSquare, active: false, count: 0 },
              { name: 'تماس صوتی', icon: Phone, active: false, count: 0 },
            ].map((ch) => (
              <div key={ch.name} className={`p-3 rounded-xl text-center ${ch.active ? 'bg-green-500/10 border border-green-500/20' : 'bg-card/50'}`}>
                <ch.icon size={20} className={`mx-auto mb-1 ${ch.active ? 'text-green-500' : 'text-muted'}`} />
                <p className="text-xs text-secondary">{ch.name}</p>
                {ch.count > 0 && <p className="text-green-500 text-xs font-bold">{ch.count}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveAlertsPage() {
  const columns: Column<Alert>[] = [
    { key: 'code', title: 'کد', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'title', title: 'عنوان' },
    { key: 'severity', title: 'شدت', render: (v) => {
      const s = severityConfig[v];
      return <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${s.bg}`}>{s.label}</span>;
    }},
    { key: 'source', title: 'منبع', render: (v) => <span className="text-xs bg-card px-2 py-0.5 rounded">{v}</span> },
    { key: 'departmentName', title: 'واحد' },
    { key: 'openedAt', title: 'زمان باز شدن' },
    { key: 'escalationLevel', title: 'سطح اسکالیشن', render: (v) => v > 0 ? <span className="text-purple-400">L{v}</span> : '-' },
    { key: 'status', title: 'وضعیت', render: (v) => <span className={`px-2 py-0.5 rounded-lg text-xs ${statusConfig[v]?.bg}`}>{statusConfig[v]?.label}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={alerts} columns={columns} title="هشدارهای فعال"
        icon={<Bell size={18} className="text-red-500" />} actions={false} />
    </div>
  );
}

function TemplatesPage() {
  const [showModal, setShowModal] = useState(false);

  const columns: Column<AlertTemplate>[] = [
    { key: 'code', title: 'کد', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'title', title: 'عنوان' },
    { key: 'severity', title: 'شدت', render: (v) => {
      const s = severityConfig[v];
      return <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${s.bg}`}>{s.label}</span>;
    }},
    { key: 'category', title: 'دسته' },
    { key: 'departmentName', title: 'واحد' },
    { key: 'source', title: 'منبع' },
    { key: 'autoClose', title: 'بسته خودکار', render: (v, row) => v ? <span className="text-green-500">✓ {row.autoCloseMinutes}min</span> : '-' },
  ];

  const formFields: FormField[] = [
    { name: 'code', label: 'کد', type: 'text', required: true },
    { name: 'title', label: 'عنوان', type: 'text', required: true },
    { name: 'severity', label: 'شدت', type: 'select', required: true, options: Object.entries(severityConfig).map(([k, v]) => ({ value: k, label: v.label })) },
    { name: 'category', label: 'دسته', type: 'text' },
    { name: 'source', label: 'منبع', type: 'select', options: [
      { value: 'plc', label: 'PLC' }, { value: 'production', label: 'تولید' },
      { value: 'warehouse', label: 'انبار' }, { value: 'cmms', label: 'نگهداری' },
      { value: 'hse', label: 'HSE' }, { value: 'quality', label: 'کیفیت' }, { value: 'manual', label: 'دستی' },
    ]},
    { name: 'message', label: 'متن هشدار', type: 'textarea', colSpan: 2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={alertTemplates} columns={columns} title="قالب‌های هشدار"
        icon={<Bell size={18} className="text-amber-500" />}
        onAdd={() => setShowModal(true)} addLabel="قالب جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(d) => { console.log(d); setShowModal(false); }}
        title="قالب هشدار جدید" fields={formFields} size="lg" />
    </div>
  );
}

function EscalationPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">قوانین اسکالیشن</h1>
      <div className="bg-card border-default rounded-2xl p-5">
        <h3 className="text-primary font-bold mb-6">مثال: هشدار دمای بالای کوره</h3>
        <div className="relative">
          {[
            { time: '۰ دقیقه', role: 'اپراتور', channels: 'In-App + SMS', action: 'اطلاع رسانی', color: '#3b82f6' },
            { time: '۵ دقیقه', role: 'سرپرست', channels: 'In-App + SMS + Email', action: 'بررسی و تأیید', color: '#f59e0b' },
            { time: '۱۵ دقیقه', role: 'مدیر تولید', channels: 'SMS + Email + تلگرام', action: 'تصمیم‌گیری', color: '#ef4444' },
            { time: '۳۰ دقیقه', role: 'مدیر کارخانه', channels: 'تمام کانال‌ها', action: 'مداخله مدیریتی', color: '#8b5cf6' },
            { time: '۶۰ دقیقه', role: 'مدیرعامل', channels: 'Voice Call + تمام کانال‌ها', action: 'تصمیم ارشد', color: '#dc2626' },
          ].map((level, i) => (
            <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: level.color }}>
                  L{i + 1}
                </div>
                {i < 4 && <div className="w-0.5 h-8 mt-1" style={{ backgroundColor: level.color, opacity: 0.3 }} />}
              </div>
              <div className="flex-1 bg-card/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary font-bold">{level.role}</span>
                  <span className="text-xs text-muted">{level.time}</span>
                </div>
                <p className="text-secondary text-sm">{level.channels}</p>
                <p className="text-xs mt-1" style={{ color: level.color }}>⚡ {level.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border-default rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-default">
          <h3 className="text-primary font-bold">قوانین تعریف شده</h3>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-default">{['قالب', 'سطح', 'انتظار', 'نقش', 'کانال‌ها', 'اقدام'].map(h => <th key={h} className="text-right text-xs text-muted px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {escalationRules.map((r) => (
              <tr key={r.id} className="border-b border-default/50 hover:bg-card/30">
                <td className="px-4 py-3 text-secondary text-xs">{r.alertTemplateId}</td>
                <td className="px-4 py-3"><span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-xs">L{r.level}</span></td>
                <td className="px-4 py-3 text-primary">{r.waitMinutes} دقیقه</td>
                <td className="px-4 py-3 text-primary">{r.notifyUserName || r.notifyRole}</td>
                <td className="px-4 py-3 text-secondary text-xs">{r.channels.join(', ')}</td>
                <td className="px-4 py-3">{r.action && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">{r.action}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AlertHistoryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">تاریخچه هشدارها</h1>
      <div className="bg-card border-default rounded-2xl overflow-hidden">
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {alerts.map((alert) => {
            const sev = severityConfig[alert.severity];
            return (
              <div key={alert.id} className="px-4 py-3 hover:bg-card/30">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sev.color }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-medium">{alert.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${sev.bg}`}>{sev.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${statusConfig[alert.status]?.bg}`}>{statusConfig[alert.status]?.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                      <span>باز: {alert.openedAt}</span>
                      {alert.resolvedAt && <span>حل: {alert.resolvedAt}</span>}
                      {alert.duration && <span>مدت: {alert.duration} دقیقه</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AlertAnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">تحلیل هشدارها</h1>
      <StatGrid columns={4}>
        <StatCard title="پرتکرارترین" value="دمای بالا" icon={<BarChart3 size={22} />} color="#ef4444" />
        <StatCard title="گران‌ترین" value="خرابی پمپ" icon={<TrendingUp size={22} />} color="#f97316" />
        <StatCard title="طولانی‌ترین" value="۵۴۰ دقیقه" icon={<Clock size={22} />} color="#8b5cf6" />
        <StatCard title="میانگین حل" value="۴۵ دقیقه" icon={<CheckCircle2 size={22} />} color="#10b981" />
      </StatGrid>
      <div className="bg-card border-default rounded-2xl p-5">
        <h3 className="text-primary font-bold mb-4">هشدارها بر اساس شدت</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={phase2ChartData.alertsBySeverity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            <Bar dataKey="value" name="تعداد" radius={[4, 4, 0, 0]}>
              {phase2ChartData.alertsBySeverity.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
