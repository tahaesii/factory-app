import { useState, useEffect, useCallback } from 'react';
import { Database, Cpu, Activity, Zap, GitBranch, CheckCircle2, Plus, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { devices as mockDevices, plcs as mockPLCs, tags as mockTags, idpEvents as mockEvents, formulas, phase2ChartData } from '@/data/phase2Data';
import { uid } from '@/services/dataService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import type { Device, PLC, Tag } from '@/types/phase2';

const API = '/api';

function apiHeaders(token: string | null) {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

const protocolColors: Record<string, string> = {
  opcua: '#3b82f6', mqtt: '#10b981', modbus_tcp: '#f59e0b',
  modbus_rtu: '#8b5cf6', ethernet_ip: '#ef4444', profinet: '#06b6d4',
};

const plcBrandColors: Record<string, { bg: string; text: string }> = {
  siemens: { bg: '#009999', text: '#fff' },
  mitsubishi: { bg: '#e4002b', text: '#fff' },
  delta: { bg: '#1976d2', text: '#fff' },
  omron: { bg: '#ef4444', text: '#fff' },
  allen_bradley: { bg: '#d4a017', text: '#000' },
  schneider: { bg: '#3dcd58', text: '#000' },
  ls: { bg: '#e20074', text: '#fff' },
  fatek: { bg: '#003087', text: '#fff' },
};

export function IDPModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch (currentPage) {
    case 'devices': return <DevicesPage />;
    case 'plcs': return <PLCsPage />;
    case 'tags': return <TagsPage />;
    case 'historian': return <HistorianPage />;
    case 'formulas': return <FormulasPage />;
    case 'events': return <EventsPage />;
    default: return <IDPDashboard />;
  }
}

function IDPDashboard() {
  const token = useAuthStore((s) => s.token);
  const [liveTags, setLiveTags] = useState<any[]>([]);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [devicesList, setDevicesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [tagsRes, eventsRes, devRes] = await Promise.all([
        fetch(`${API}/idp/live`, { headers: apiHeaders(token) }).then(r => r.ok ? r.json() : Promise.reject()),
        fetch(`${API}/idp/events?limit=10`, { headers: apiHeaders(token) }).then(r => r.ok ? r.json() : Promise.reject()),
        fetch(`${API}/idp/devices`, { headers: apiHeaders(token) }).then(r => r.ok ? r.json() : Promise.reject()),
      ]);
      setLiveTags(tagsRes);
      setLiveEvents(eventsRes);
      setDevicesList(devRes);
    } catch {
      setLiveTags(mockTags as any);
      setLiveEvents(mockEvents as any);
      setDevicesList(mockDevices as any);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); const iv = setInterval(fetchData, 10000); return () => clearInterval(iv); }, [fetchData]);

  const onlineCount = devicesList.filter((d: any) => d.status === 'online').length;
  const totalTagCount = liveTags.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">پلتفرم داده صنعتی (IDP)</h1>
          <p className="text-muted">مرکز جمع‌آوری، پردازش و آنالیز داده‌های کارخانه</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 bg-card hover:bg-zinc-700 text-primary text-sm rounded-xl transition-all">
          <RefreshCw size={14} /> بروزرسانی
        </button>
      </div>

      <StatGrid columns={4}>
        <StatCard title="دستگاه‌های آنلاین" value={`${onlineCount}/${devicesList.length}`} change="实时" changeType="up" icon={<Cpu size={22} />} color="#3b82f6" />
        <StatCard title="کل تگ‌های فعال" value={totalTagCount} icon={<Database size={22} />} color="#10b981" />
        <StatCard title="رویدادهای امروز" value={liveEvents.length} icon={<Activity size={22} />} color="#f59e0b" />
        <StatCard title="فرمول‌های فعال" value={formulas.length} icon={<GitBranch size={22} />} color="#8b5cf6" />
      </StatGrid>

      <div className="grid lg:grid-cols-3 gap-4">
        {(loading ? mockTags : liveTags).slice(0, 6).map((tag: any) => {
          const isAlarm = tag.alarmEnabled && (
            (tag.alarmHigh && Number(tag.currentValue) > tag.alarmHigh) ||
            (tag.alarmLow && Number(tag.currentValue) < tag.alarmLow)
          );
          return (
            <div key={tag.id || tag.name} className={`bg-card border rounded-2xl p-4 transition-all ${isAlarm ? 'border-red-500/50' : 'border-default'}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-muted text-xs">{tag.deviceName || tag.deviceId || ''}</p>
                  <p className="text-primary font-medium">{tag.name}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${tag.quality === 'good' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              </div>
              <div className="flex items-end gap-1">
                <span className={`text-3xl font-black ${isAlarm ? 'text-red-400' : 'text-primary'}`}>
                  {typeof tag.currentValue === 'boolean' ? (tag.currentValue ? 'ON' : 'OFF') : Number(tag.currentValue || 0).toFixed(1)}
                </span>
                <span className="text-muted text-sm mb-1">{tag.unit}</span>
              </div>
              {tag.alarmEnabled && tag.alarmHigh && (
                <div className="mt-2 w-full bg-card rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${isAlarm ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (Number(tag.currentValue || 0) / (tag.alarmHigh || tag.max || 1000)) * 100)}%` }}
                  />
                </div>
              )}
              <p className="text-muted text-[10px] mt-1">{tag.timestamp ? new Date(tag.timestamp).toLocaleString('fa-IR') : ''}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-default rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary font-bold flex items-center gap-2">
            <Activity size={16} className="text-blue-500" /> روند زنده تگ‌ها
          </h3>
          <div className="flex items-center gap-2">
            {['دما', 'فشار', 'RPM'].map((tag) => (
              <span key={tag} className="text-xs bg-card px-2 py-1 rounded-lg text-secondary">{tag}</span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={phase2ChartData.tagTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis yAxisId="temp" tick={{ fill: '#71717a', fontSize: 11 }} domain={[800, 900]} />
            <YAxis yAxisId="pressure" orientation="right" tick={{ fill: '#71717a', fontSize: 11 }} domain={[170, 200]} />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            <Legend />
            <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} dot={false} name="دما (°C)" />
            <Line yAxisId="pressure" type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} dot={false} name="فشار (bar)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-default rounded-2xl p-5">
        <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
          <Zap size={16} className="text-amber-500" /> رویدادهای اخیر
        </h3>
        <div className="space-y-2">
          {(loading ? mockEvents : liveEvents).map((ev: any) => (
            <div key={ev.id} className={`flex items-center gap-3 p-3 rounded-xl ${ev.acknowledged ? 'bg-card' : 'bg-card border border-default'}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.type === 'alarm' ? 'bg-red-500 animate-pulse' : ev.type === 'machine_stop' ? 'bg-amber-500' : 'bg-green-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-primary text-sm truncate">{ev.message}</p>
                <p className="text-muted text-xs">{ev.deviceName} • {ev.timestamp ? new Date(ev.timestamp).toLocaleString('fa-IR') : ''}</p>
              </div>
              {ev.acknowledged ? (
                <span className="text-xs text-green-500">تأیید شد</span>
              ) : (
                <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg">تأیید</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DevicesPage() {
  const token = useAuthStore((s) => s.token);
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`${API}/idp/devices`, { headers: apiHeaders(token) });
      if (res.ok) setItems(await res.json());
      else setItems(mockDevices as any);
    } catch { setItems(mockDevices as any); }
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const columns: Column<any>[] = [
    { key: 'name', title: 'نام دستگاه', render: (v, row) => (
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${row.status === 'online' ? 'bg-green-500 animate-pulse' : row.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
        <div>
          <p className="text-primary font-medium">{v}</p>
          <p className="text-muted text-xs">{row.brand} {row.model}</p>
        </div>
      </div>
    )},
    { key: 'type', title: 'نوع', render: (v) => {
      const types: Record<string, string> = { plc: 'PLC', sensor: 'سنسور', hmi: 'HMI', drive: 'درایو', meter: 'کنتور', camera: 'دوربین', scale: 'ترازو', other: 'سایر' };
      return <span className="text-xs bg-card px-2 py-0.5 rounded">{types[v] || v}</span>;
    }},
    { key: 'ipAddress', title: 'آدرس IP', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'protocol', title: 'پروتکل', render: (v) => (
      <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: `${protocolColors[v]}20`, color: protocolColors[v] }}>
        {(v || '').toUpperCase().replace('_', ' ')}
      </span>
    )},
    { key: 'tagCount', title: 'تگ‌ها' },
    { key: 'lastSeen', title: 'آخرین اتصال', render: (v) => <span className="text-xs text-muted">{v ? new Date(v).toLocaleString('fa-IR') : ''}</span> },
    { key: 'status', title: 'وضعیت', render: (v) => {
      const s: Record<string, { l: string; c: string }> = { online: { l: 'آنلاین', c: 'text-green-500 bg-green-500/10' }, offline: { l: 'آفلاین', c: 'text-red-500 bg-red-500/10' }, warning: { l: 'هشدار', c: 'text-amber-500 bg-amber-500/10' }, error: { l: 'خطا', c: 'text-red-500 bg-red-500/10' } };
      return <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${s[v]?.c}`}>{s[v]?.l}</span>;
    }},
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'نام دستگاه', type: 'text', required: true },
    { name: 'type', label: 'نوع', type: 'select', required: true, options: [
      { value: 'plc', label: 'PLC' }, { value: 'sensor', label: 'سنسور' },
      { value: 'hmi', label: 'HMI' }, { value: 'drive', label: 'درایو' },
      { value: 'meter', label: 'کنتور' }, { value: 'other', label: 'سایر' },
    ]},
    { name: 'brand', label: 'برند', type: 'text', required: true },
    { name: 'model', label: 'مدل', type: 'text', required: true },
    { name: 'serialNumber', label: 'شماره سریال', type: 'text' },
    { name: 'ipAddress', label: 'آدرس IP', type: 'text', required: true, placeholder: '192.168.10.10' },
    { name: 'macAddress', label: 'آدرس MAC', type: 'text', placeholder: '00:1A:2B:3C:4D:5E' },
    { name: 'protocol', label: 'پروتکل', type: 'select', required: true, options: [
      { value: 'opcua', label: 'OPC-UA' }, { value: 'mqtt', label: 'MQTT' },
      { value: 'modbus_tcp', label: 'Modbus TCP' }, { value: 'modbus_rtu', label: 'Modbus RTU' },
      { value: 'ethernet_ip', label: 'Ethernet/IP' }, { value: 'profinet', label: 'Profinet' },
    ]},
    { name: 'lineId', label: 'خط تولید', type: 'select', options: [
      { value: 'L-001', label: 'خط ۱' }, { value: 'L-002', label: 'خط ۲' },
      { value: 'L-003', label: 'خط ۳' }, { value: 'L-004', label: 'خط ۴' },
    ]},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={loading ? mockDevices : items} columns={columns} title="ثبت دستگاه‌ها" icon={<Cpu size={18} className="text-blue-500" />}
        onAdd={() => setShowModal(true)} onEdit={() => setShowModal(true)} addLabel="دستگاه جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={async (d) => {
        const res = await fetch(`${API}/idp/devices`, { method: 'POST', headers: apiHeaders(token), body: JSON.stringify(d) });
        if (res.ok) {
          const created = await res.json();
          setItems((prev) => [...prev, created]);
        }
        setShowModal(false);
      }} title="دستگاه جدید" fields={formFields} size="lg" />
    </div>
  );
}

function PLCsPage() {
  const token = useAuthStore((s) => s.token);
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`${API}/idp/plcs`, { headers: apiHeaders(token) });
      if (res.ok) setItems(await res.json());
      else setItems(mockPLCs as any);
    } catch { setItems(mockPLCs as any); }
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const plcFormFields: FormField[] = [
    { name: 'name', label: 'نام PLC', type: 'text', required: true },
    { name: 'brand', label: 'برند', type: 'select', required: true, options: [
      { value: 'siemens', label: 'Siemens' }, { value: 'mitsubishi', label: 'Mitsubishi' },
      { value: 'delta', label: 'Delta' }, { value: 'omron', label: 'Omron' },
      { value: 'allen_bradley', label: 'Allen-Bradley' }, { value: 'schneider', label: 'Schneider' },
      { value: 'ls', label: 'LS' }, { value: 'fatek', label: 'Fatek' },
    ]},
    { name: 'model', label: 'مدل', type: 'text', required: true },
    { name: 'ipAddress', label: 'آدرس IP', type: 'text', required: true, placeholder: '192.168.10.10' },
    { name: 'rack', label: 'Rack', type: 'number', required: true },
    { name: 'slot', label: 'Slot', type: 'number', required: true },
    { name: 'protocol', label: 'پروتکل', type: 'select', required: true, options: [
      { value: 'OPC-UA', label: 'OPC-UA' }, { value: 'Modbus TCP', label: 'Modbus TCP' },
      { value: 'Modbus RTU', label: 'Modbus RTU' }, { value: 'Ethernet/IP', label: 'Ethernet/IP' },
    ]},
    { name: 'scanRate', label: 'Scan Rate (ms)', type: 'number', required: true },
    { name: 'lineId', label: 'خط تولید', type: 'select', options: [
      { value: 'L-001', label: 'خط ۱' }, { value: 'L-002', label: 'خط ۲' },
      { value: 'L-003', label: 'خط ۳' }, { value: 'L-004', label: 'خط ۴' },
    ]},
  ];

  const columns: Column<any>[] = [
    { key: 'name', title: 'نام PLC', render: (v, row) => (
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: plcBrandColors[row.brand]?.bg, color: plcBrandColors[row.brand]?.text }}>
          {(row.brand || '').toUpperCase()}
        </span>
        <span className="text-primary">{v}</span>
      </div>
    )},
    { key: 'model', title: 'مدل' },
    { key: 'ipAddress', title: 'IP', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'rack', title: 'Rack' },
    { key: 'slot', title: 'Slot' },
    { key: 'protocol', title: 'پروتکل', render: (v) => <span className="text-xs bg-card px-2 py-0.5 rounded">{v}</span> },
    { key: 'scanRate', title: 'Scan Rate', render: (v) => `${v}ms` },
    { key: 'tagCount', title: 'تگ‌ها' },
    { key: 'status', title: 'وضعیت', render: (v) => (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${v === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className={`text-xs ${v === 'connected' ? 'text-green-500' : 'text-red-500'}`}>{v === 'connected' ? 'متصل' : 'قطع'}</span>
      </div>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 p-4 bg-card border border-default rounded-2xl">
        <p className="text-muted text-xs col-span-full mb-1">برندهای پشتیبانی شده</p>
        {Object.entries(plcBrandColors).map(([brand, colors]) => (
          <div key={brand} className="text-center">
            <div className="w-full py-2 rounded-lg text-[10px] font-bold" style={{ backgroundColor: colors.bg, color: colors.text }}>
              {brand === 'allen_bradley' ? 'A-B' : brand.charAt(0).toUpperCase() + brand.slice(1)}
            </div>
          </div>
        ))}
      </div>
      <DataTable data={loading ? mockPLCs : items} columns={columns} title="مدیریت PLC" icon={<Database size={18} className="text-purple-500" />}
        onAdd={() => setShowModal(true)} addLabel="PLC جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={async (d) => {
        const payload = { ...d, type: 'plc', rack: Number(d.rack), slot: Number(d.slot), scanRate: Number(d.scanRate) };
        const res = await fetch(`${API}/idp/devices`, { method: 'POST', headers: apiHeaders(token), body: JSON.stringify(payload) });
        if (res.ok) {
          const created = await res.json();
          setItems((prev) => [...prev, created]);
        }
        setShowModal(false);
      }} title="PLC جدید" fields={plcFormFields} size="lg" />
    </div>
  );
}

function TagsPage() {
  const token = useAuthStore((s) => s.token);
  const [items, setItems] = useState<any[]>([]);
  const [devicesList, setDevicesList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [tagsRes, devRes] = await Promise.all([
        fetch(`${API}/idp/tags`, { headers: apiHeaders(token) }).then(r => r.ok ? r.json() : Promise.reject()),
        fetch(`${API}/idp/devices`, { headers: apiHeaders(token) }).then(r => r.ok ? r.json() : Promise.reject()),
      ]);
      setItems(tagsRes);
      setDevicesList(devRes);
    } catch {
      setItems(mockTags as any);
      setDevicesList(mockDevices as any);
    }
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const deviceOptions = devicesList.map((d: any) => ({ value: d.id, label: d.name }));

  const tagFormFields: FormField[] = [
    { name: 'name', label: 'نام تگ', type: 'text', required: true },
    { name: 'address', label: 'آدرس', type: 'text', required: true, placeholder: 'DB100.DBD0' },
    { name: 'tagType', label: 'نوع تگ', type: 'select', required: true, options: [
      { value: 'temperature', label: 'دما' }, { value: 'pressure', label: 'فشار' },
      { value: 'speed', label: 'سرعت' }, { value: 'rpm', label: 'RPM' },
      { value: 'current', label: 'جریان' }, { value: 'voltage', label: 'ولتاژ' },
      { value: 'counter', label: 'شمارنده' }, { value: 'status', label: 'وضعیت' },
      { value: 'alarm', label: 'هشدار' }, { value: 'humidity', label: 'رطوبت' },
      { value: 'weight', label: 'وزن' },
    ]},
    { name: 'unit', label: 'واحد', type: 'text', required: true, placeholder: '°C, bar, RPM, ...' },
    { name: 'dataType', label: 'نوع داده', type: 'select', required: true, options: [
      { value: 'bool', label: 'Bool' }, { value: 'int', label: 'Integer' },
      { value: 'float', label: 'Float' },
    ]},
    { name: 'deviceId', label: 'دستگاه', type: 'select', required: true, options: deviceOptions },
    { name: 'alarmEnabled', label: 'فعالسازی هشدار', type: 'checkbox' },
    { name: 'alarmHigh', label: 'هشدار بالا', type: 'number' },
    { name: 'alarmLow', label: 'هشدار پایین', type: 'number' },
  ];

  const columns: Column<any>[] = [
    { key: 'name', title: 'نام تگ' },
    { key: 'address', title: 'آدرس', render: (v) => <span className="font-mono text-xs text-blue-400">{v}</span> },
    { key: 'tagType', title: 'نوع', render: (v) => {
      const icons: Record<string, string> = { temperature: '🌡️', pressure: '📊', rpm: '⚙️', current: '⚡', voltage: '🔋', counter: '🔢', status: '🔘', alarm: '🚨', humidity: '💧', speed: '🏃', weight: '⚖️' };
      return <span>{icons[v] || '📌'} {v}</span>;
    }},
    { key: 'unit', title: 'واحد' },
    { key: 'currentValue', title: 'مقدار فعلی', render: (v, row) => {
      const isAlarm = row.alarmEnabled && row.alarmHigh && Number(v) > row.alarmHigh;
      return <span className={`font-bold ${isAlarm ? 'text-red-400' : 'text-primary'}`}>{typeof v === 'boolean' ? (v ? 'ON' : 'OFF') : `${Number(v || 0).toFixed(1)} ${row.unit}`}</span>;
    }},
    { key: 'quality', title: 'کیفیت', render: (v) => <span className={`text-xs ${v === 'good' ? 'text-green-500' : v === 'bad' ? 'text-red-500' : 'text-amber-500'}`}>{v === 'good' ? '✓ خوب' : v === 'bad' ? '✗ بد' : '? نامشخص'}</span> },
    { key: 'deviceName', title: 'دستگاه', render: (v) => <span className="text-xs text-secondary">{v || ''}</span> },
    { key: 'alarmEnabled', title: 'هشدار', render: (v) => v ? <CheckCircle2 size={14} className="text-green-500" /> : <span className="text-muted">-</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={loading ? mockTags : items} columns={columns} title="مدیریت تگ‌ها"
        icon={<Database size={18} className="text-green-500" />}
        onAdd={() => setShowModal(true)} onView={(t) => setSelectedTag(t)} addLabel="تگ جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={async (d) => {
        const payload = {
          ...d,
          alarmEnabled: d.alarmEnabled === true || d.alarmEnabled === 'true',
          alarmHigh: d.alarmHigh ? Number(d.alarmHigh) : undefined,
          alarmLow: d.alarmLow ? Number(d.alarmLow) : undefined,
          currentValue: 0, quality: 'good',
        };
        const res = await fetch(`${API}/idp/tags`, { method: 'POST', headers: apiHeaders(token), body: JSON.stringify(payload) });
        if (res.ok) {
          const created = await res.json();
          setItems((prev) => [...prev, created]);
        }
        setShowModal(false);
      }} title="تگ جدید" fields={tagFormFields} size="lg" />

      {selectedTag && (
        <div className="bg-card border border-default rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4">جزئیات تگ: {selectedTag.name}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div><span className="text-muted text-xs">آدرس</span><p className="text-primary font-mono">{selectedTag.address}</p></div>
            <div><span className="text-muted text-xs">بازه</span><p className="text-primary">{selectedTag.min || 0} - {selectedTag.max || 100} {selectedTag.unit}</p></div>
            <div><span className="text-muted text-xs">Deadband</span><p className="text-primary">{selectedTag.deadband || 0}</p></div>
            <div><span className="text-muted text-xs">Scan Rate</span><p className="text-primary">{selectedTag.scanRate || 1000}ms</p></div>
            {selectedTag.alarmHigh && <div><span className="text-muted text-xs">هشدار بالا</span><p className="text-red-400">{selectedTag.alarmHigh} {selectedTag.unit}</p></div>}
            {selectedTag.alarmLow && <div><span className="text-muted text-xs">هشدار پایین</span><p className="text-blue-400">{selectedTag.alarmLow} {selectedTag.unit}</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}

function HistorianPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-primary">تاریخچه داده (Historian)</h1>
        <p className="text-muted text-sm">نمایش و تحلیل داده‌های تاریخی تگ‌ها</p>
      </div>
      <div className="bg-card border border-default rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select className="bg-card border border-default rounded-xl px-3 py-2 text-primary text-sm focus:border-blue-500 outline-none">
            <option>دمای کوره ۱</option>
            <option>فشار هیدرولیک</option>
            <option>سرعت موتور</option>
          </select>
          <select className="bg-card border border-default rounded-xl px-3 py-2 text-primary text-sm focus:border-blue-500 outline-none">
            <option>۲۴ ساعت گذشته</option>
            <option>۷ روز گذشته</option>
            <option>۳۰ روز گذشته</option>
          </select>
          <select className="bg-card border border-default rounded-xl px-3 py-2 text-primary text-sm focus:border-blue-500 outline-none">
            <option>دقیقه</option>
            <option>ساعت</option>
            <option>روز</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={phase2ChartData.tagTrend}>
            <defs>
              <linearGradient id="gradHist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} domain={[800, 900]} />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} />
            <Area type="monotone" dataKey="temp" stroke="#ef4444" fill="url(#gradHist)" name="دما (°C)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FormulasPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Formula Builder</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> فرمول جدید</button>
      </div>
      <div className="space-y-4">
        {formulas.map((f) => (
          <div key={f.id} className="bg-card border border-default rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-primary font-bold">{f.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-blue-400">{typeof f.lastValue === 'number' && f.lastValue > 1000 ? f.lastValue.toLocaleString() : f.lastValue} {f.unit}</span>
              </div>
            </div>
            <code className="block bg-card rounded-xl px-4 py-3 text-green-400 text-sm font-mono mb-3">{f.expression}</code>
            <div className="flex items-center gap-2">
              <span className="text-muted text-xs">تگ‌های وابسته:</span>
              {f.tags.map((t) => <span key={t} className="text-xs bg-card text-secondary px-2 py-0.5 rounded">{t}</span>)}
            </div>
            <p className="text-muted text-xs mt-2">آخرین محاسبه: {f.lastCalculated}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsPage() {
  const token = useAuthStore((s) => s.token);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`${API}/idp/events?limit=50`, { headers: apiHeaders(token) });
      if (res.ok) setItems(await res.json());
      else setItems(mockEvents as any);
    } catch { setItems(mockEvents as any); }
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-primary">رویدادهای سیستم</h1>
      <div className="bg-card border border-default rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-default flex items-center justify-between">
          <span className="text-primary font-bold">رویدادهای اخیر</span>
          <span className="text-xs text-muted">{items.length} رویداد</span>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-zinc-800">
          {(loading ? mockEvents : items).map((ev: any) => (
            <div key={ev.id} className="px-4 py-3 hover:bg-card transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ev.type === 'alarm' ? 'bg-red-500' : ev.type === 'machine_stop' ? 'bg-amber-500' : ev.type === 'batch_start' ? 'bg-blue-500' : 'bg-green-500'}`} />
                <div className="flex-1">
                  <p className="text-primary text-sm">{ev.message}</p>
                  <p className="text-muted text-xs mt-0.5">{ev.deviceName} • {ev.timestamp ? new Date(ev.timestamp).toLocaleString('fa-IR') : ''}</p>
                  {ev.value !== undefined && <p className="text-secondary text-xs">مقدار: {String(ev.value)}</p>}
                </div>
                {ev.acknowledged ? (
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5" />
                ) : (
                  <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded">تأیید</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
