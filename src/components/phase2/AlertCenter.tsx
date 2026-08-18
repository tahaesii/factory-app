import { useState, useEffect } from 'react';
import { Bell, TriangleAlert, CheckCircle2, XCircle, Clock, Zap, Phone, Mail, MessageSquare, BarChart3, TrendingUp, Activity, Eye, RefreshCw, Loader2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/appStore';
import { useApiConfigStore } from '@/store/apiConfigStore';
import { telemetryService } from '@/services/telemetryService';
import { sensorAlertWebSocket } from '@/services/sensorAlertWebSocket';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { alerts, alertTemplates, escalationRules, phase2ChartData } from '@/data/phase2Data';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AlertTemplate, SensorAlertEvent } from '@/types/phase2';

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

/* ⚠️ TEMPORARY DEMO — remove when backend is live */
const DEMO_MODE = true;

const DEMO_ACTIVE_EVENTS: SensorAlertEvent[] = [
  {
    id: 42, rule: 3, name_rule: "دما — حد اکثر 80°C", sensor_id: "temp_01",
    value: 85.3, severity: "critical", message: "دما از حداکثر مقدار (80) عبور کرده است",
    triggered_at: "1403/06/15 14:32:08", resolved_at: null, resolved_value: null,
    resolved_note: null, is_active: true, operator_note: null, is_reviewed: false,
    reviewed_by: null, reviewed_by_name: null, reviewed_at: null,
  },
  {
    id: 43, rule: 5, name_rule: "فشار — حداقل 1.5 bar", sensor_id: "pressure_03",
    value: 1.2, severity: "warning", message: "فشار زیر حداقل مقدار (1.5) است",
    triggered_at: "1403/06/15 14:30:45", resolved_at: null, resolved_value: null,
    resolved_note: null, is_active: true, operator_note: null, is_reviewed: true,
    reviewed_by: "1", reviewed_by_name: "علی احمدی", reviewed_at: "1403/06/15 14:31:00",
  },
];

/* ⚠️ TEMPORARY DEMO — remove when backend is live */
const DEMO_HISTORY_EVENTS: SensorAlertEvent[] = [
  {
    id: 42, rule: 3, name_rule: "دما — حد اکثر 80°C", sensor_id: "temp_01",
    value: 85.3, severity: "critical", message: "دما از حداکثر مقدار (80) عبور کرده است",
    triggered_at: "1403/06/15 14:32:08", resolved_at: "1403/06/15 15:10:30",
    resolved_value: 72.1, resolved_note: "سیستم خنک‌کننده فعال شد",
    is_active: false, operator_note: "بررسی شد — دما ثابت شد", is_reviewed: true,
    reviewed_by: "1", reviewed_by_name: "علی احمدی", reviewed_at: "1403/06/15 14:45:00",
  },
  ...DEMO_ACTIVE_EVENTS,
  {
    id: 44, rule: 7, name_rule: "سرعت — حداکثر 3000 RPM", sensor_id: "speed_02",
    value: 3200, severity: "critical", message: "سرعت موتور از حداکثر (3000) عبور کرده است",
    triggered_at: "1403/06/15 12:15:00", resolved_at: "1403/06/15 12:25:00",
    resolved_value: 2800, resolved_note: "دستیار هشدار داد — سرعت نرمال شد",
    is_active: false, operator_note: "", is_reviewed: false,
    reviewed_by: null, reviewed_by_name: null, reviewed_at: null,
  },
];

function ActiveAlertsPage() {
  const [events, setEvents] = useState<SensorAlertEvent[]>(
    DEMO_MODE ? DEMO_ACTIVE_EVENTS : [],
  );
  const [loading, setLoading] = useState(false);
  const [detailEvent, setDetailEvent] = useState<SensorAlertEvent | null>(null);
  const wsStatus = useApiConfigStore((s) => s.wsConnectionStatus);
  const wsStatusColor = wsStatus === "connected" ? "text-green-500" : wsStatus === "connecting" ? "text-amber-500" : "text-zinc-500";

  const fetchActiveEvents = async (showSpinner = true) => {
    if (DEMO_MODE) return; // Skip API call in demo mode
    if (showSpinner) setLoading(true);
    try {
      const data = await telemetryService.getAlertEvents({ only_active: true });
      setEvents(data);
    } catch (err: any) {
      // Keep existing events on error
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveEvents(false);
    if (!DEMO_MODE) sensorAlertWebSocket.connect();

    const unsubscribe = sensorAlertWebSocket.subscribe((payload) => {
      const event = payload.data as SensorAlertEvent;
      if (payload.type === "triggered") {
        setEvents((prev) => [event, ...prev]);
      } else if (payload.type === "resolved") {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      } else if (payload.type === "reviewed") {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === event.id
              ? { ...e, is_reviewed: event.is_reviewed, operator_note: event.operator_note, reviewed_at: event.reviewed_at, reviewed_by_name: event.reviewed_by_name }
              : e,
          ),
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const columns: Column<SensorAlertEvent>[] = [
    {
      key: "id",
      title: "کد",
      render: (v) => <span className="font-mono text-blue-400">#{v}</span>,
    },
    {
      key: "name_rule",
      title: "قانون هشدار",
      render: (v) => <span className="text-primary">{v}</span>,
    },
    {
      key: "sensor_id",
      title: "سنسور",
      render: (v) => <span className="font-mono text-xs text-muted">{v}</span>,
    },
    {
      key: "value",
      title: "مقدار",
      render: (v) => <span className="text-primary font-mono">{v}</span>,
    },
    {
      key: "severity",
      title: "شدت",
      render: (v) => {
        const s = severityConfig[v];
        return (
          <span
            className={`px-2 py-0.5 rounded-lg text-xs font-medium ${s.bg}`}
          >
            {s.label}
          </span>
        );
      },
    },
    {
      key: "message",
      title: "پیام",
    },
    {
      key: "triggered_at",
      title: "زمان باز شدن",
      render: (v) => <span className="text-muted text-xs">{v}</span>,
    },
    {
      key: "is_reviewed",
      title: "بررسی",
      render: (v) =>
        v ? (
          <CheckCircle2 size={14} className="text-green-500 mx-auto" />
        ) : (
          <XCircle size={14} className="text-zinc-600 mx-auto" />
        ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary">
            هشدارهای فعال سنسور
          </h1>
          <span className={`text-xs font-medium ${wsStatusColor}`}>
            {wsStatus === "connected"
              ? "● لحظه‌ای متصل"
              : wsStatus === "connecting"
              ? "● در حال اتصال..."
              : "○ قطع"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchActiveEvents(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-xl text-sm transition-all disabled:opacity-50"
            title="بروزرسانی"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            بروزرسانی
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="animate-spin text-muted" />
        </div>
      )}

      {!loading && (
        <DataTable
          data={events}
          columns={columns}
          onView={(row) => setDetailEvent(row)}
          emptyMessage="هیچ هشدار فعالی وجود ندارد"
        />
      )}

      {detailEvent && (
        <SensorAlertEventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
        />
      )}
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
  const [events, setEvents] = useState<SensorAlertEvent[]>(
    DEMO_MODE ? DEMO_HISTORY_EVENTS : [],
  );
  const [loading, setLoading] = useState(false);
  const [detailEvent, setDetailEvent] = useState<SensorAlertEvent | null>(null);

  const fetchAllEvents = async (showSpinner = true) => {
    if (DEMO_MODE) return; // Skip API call in demo mode
    if (showSpinner) setLoading(true);
    try {
      const data = await telemetryService.getAlertEvents();
      setEvents(data);
    } catch (err: any) {
      // Keep existing events on error
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents(false);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">تاریخچه هشدارهای سنسور</h1>
        <button
          onClick={() => fetchAllEvents(true)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-xl text-sm transition-all disabled:opacity-50"
          title="بروزرسانی"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          بروزرسانی
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="animate-spin text-muted" />
        </div>
      )}

      {!loading && (
        <div className="bg-card border border-default rounded-2xl overflow-hidden">
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {events.map((event) => {
              const sev = severityConfig[event.severity];
              return (
                <div key={event.id} className="px-4 py-3 hover:bg-card/30 cursor-pointer" onClick={() => setDetailEvent(event)}>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sev.color }} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-medium">{event.name_rule}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${sev.bg}`}>{sev.label}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            event.is_active
                              ? "bg-red-500/10 text-red-500"
                              : "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {event.is_active ? "فعال" : "حل شده"}
                        </span>
                        {event.is_reviewed ? (
                          <CheckCircle2 size={12} className="text-green-500" />
                        ) : (
                          <XCircle size={12} className="text-zinc-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                        <span>سنسور: {event.sensor_id}</span>
                        <span>مقدار: {event.value}</span>
                        <span>باز: {event.triggered_at}</span>
                        {event.resolved_at && <span>حل: {event.resolved_at}</span>}
                      </div>
                    </div>
                    <Eye size={14} className="text-muted" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {detailEvent && (
        <SensorAlertEventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
        />
      )}
    </div>
  );
}

function SensorAlertEventDetailModal({
  event,
  onClose,
}: {
  event: SensorAlertEvent;
  onClose: () => void;
}) {
  const [operatorNote, setOperatorNote] = useState(event.operator_note ?? "");
  const [isReviewed, setIsReviewed] = useState(event.is_reviewed ?? false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await telemetryService.updateAlertEvent(event.id, {
        operator_note: operatorNote,
        is_reviewed: isReviewed,
      });
      toast.success("نظرات اپراتوری ذخیره شد");
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "خطا در ذخیره نظرات";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const sev = severityConfig[event.severity];
  const SevIcon = sev.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-card border border-default rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${sev.bg}`}
            >
              <SevIcon size={18} style={{ color: sev.color }} />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">
                جزئیات هشدار سنسور #{event.id}
              </h3>
              <p className="text-xs text-muted">
                {sev.label} • {event.name_rule}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-primary hover:bg-card rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-10rem)] space-y-4">
          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted text-xs">قانون هشدار</span>
              <p className="text-primary font-medium mt-0.5">
                {event.name_rule}
              </p>
            </div>
            <div>
              <span className="text-muted text-xs">شناسه قانون</span>
              <p className="text-primary font-medium mt-0.5">{event.rule}</p>
            </div>
            <div>
              <span className="text-muted text-xs">سنسور</span>
              <p className="text-primary font-mono text-xs mt-0.5">
                {event.sensor_id}
              </p>
            </div>
            <div>
              <span className="text-muted text-xs">مقدار</span>
              <p className="text-primary font-mono mt-0.5">{event.value}</p>
            </div>
            <div>
              <span className="text-muted text-xs">زمان باز شدن</span>
              <p className="text-primary mt-0.5 text-xs">
                {event.triggered_at}
              </p>
            </div>
            <div>
              <span className="text-muted text-xs">زمان حل</span>
              <p className="text-primary mt-0.5 text-xs">
                {event.resolved_at ?? "—"}
              </p>
            </div>
            {event.resolved_value !== null && (
              <div>
                <span className="text-muted text-xs">مقدار حل</span>
                <p className="text-primary font-mono mt-0.5">
                  {event.resolved_value}
                </p>
              </div>
            )}
            {event.resolved_note && (
              <div className="col-span-2">
                <span className="text-muted text-xs">یادداشت حل</span>
                <p className="text-primary mt-0.5">{event.resolved_note}</p>
              </div>
            )}
            <div className="col-span-2">
              <span className="text-muted text-xs">پیام هشدار</span>
              <p className="text-primary mt-0.5">{event.message}</p>
            </div>
          </div>

          {/* Review Section */}
          <div className="border-t border-default pt-4 space-y-4">
            <h4 className="text-sm font-bold text-primary">
              بررسی توسط اپراتور
            </h4>

            <div>
              <label className="block text-xs text-muted mb-1">
                یادداشت اپراتور
              </label>
              <textarea
                value={operatorNote}
                onChange={(e) => setOperatorNote(e.target.value)}
                placeholder="یادداشت خود را وارد کنید..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-primary placeholder:text-muted outline-none focus:border-blue-500 transition-all"
                rows={3}
                disabled={saving}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isReviewed}
                  onChange={(e) => setIsReviewed(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-600 focus:ring-blue-500"
                  disabled={saving}
                />
                <span className="text-sm text-primary">
                  بررسی شده / تأیید شده
                </span>
              </label>
              {event.reviewed_by_name && (
                <span className="text-xs text-muted">
                  ({event.reviewed_by_name}
                  {event.reviewed_at && ` در ${event.reviewed_at}`})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-default">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-muted hover:text-primary hover:bg-card rounded-xl transition-all text-sm"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all text-sm"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            ذخیره
          </button>
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
