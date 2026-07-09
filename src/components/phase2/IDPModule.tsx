import { useState, useEffect, useCallback } from "react";
import {
  Database,
  Cpu,
  Activity,
  Zap,
  GitBranch,
  CheckCircle2,
  Plus,
  RefreshCw,
  Gauge,
  Save,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatCard, { StatGrid } from "@/components/ui/StatCard";
import FormModal, { FormField } from "@/components/ui/FormModal";
import {
  devices as mockDevices,
  plcs as mockPLCs,
  tags as mockTags,
  idpEvents as mockEvents,
  formulas,
  phase2ChartData,
} from "@/data/phase2Data";
import { uid } from "@/services/dataService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import type { Device, PLC, Tag } from "@/types/phase2";
import {
  Sensor,
  SensorConfig,
  telemetryService,
} from "@/services/telemetryService";

const API = "/api";

function apiHeaders(token: string | null) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

const protocolColors: Record<string, string> = {
  opcua: "#3b82f6",
  mqtt: "#10b981",
  modbus_tcp: "#f59e0b",
  modbus_rtu: "#8b5cf6",
  ethernet_ip: "#ef4444",
  profinet: "#06b6d4",
};

const plcBrandColors: Record<string, { bg: string; text: string }> = {
  siemens: { bg: "#009999", text: "#fff" },
  mitsubishi: { bg: "#e4002b", text: "#fff" },
  delta: { bg: "#1976d2", text: "#fff" },
  omron: { bg: "#ef4444", text: "#fff" },
  allen_bradley: { bg: "#d4a017", text: "#000" },
  schneider: { bg: "#3dcd58", text: "#000" },
  ls: { bg: "#e20074", text: "#fff" },
  fatek: { bg: "#003087", text: "#fff" },
};

export function IDPModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch (currentPage) {
    case "devices":
      return <DevicesPage />;
    case "plcs":
      return <PLCsPage />;
    case "tags":
      return <TagsPage />;
    case "historian":
      return <HistorianPage />;
    case "sensor-config":
      return <SensorConfigPage />;
    case "formulas":
      return <FormulasPage />;
    case "events":
      return <EventsPage />;
    default:
      return <IDPDashboard />;
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
        fetch(`${API}/idp/live`, { headers: apiHeaders(token) }).then((r) =>
          r.ok ? r.json() : Promise.reject(),
        ),
        fetch(`${API}/idp/events?limit=10`, {
          headers: apiHeaders(token),
        }).then((r) => (r.ok ? r.json() : Promise.reject())),
        fetch(`${API}/idp/devices`, { headers: apiHeaders(token) }).then((r) =>
          r.ok ? r.json() : Promise.reject(),
        ),
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

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 10000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const onlineCount = devicesList.filter(
    (d: any) => d.status === "online",
  ).length;
  const totalTagCount = liveTags.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            پلتفرم داده صنعتی (IDP)
          </h1>
          <p className="text-muted">
            مرکز جمع‌آوری، پردازش و آنالیز داده‌های کارخانه
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3 py-2 bg-card hover:bg-zinc-700 text-primary text-sm rounded-xl transition-all"
        >
          <RefreshCw size={14} /> بروزرسانی
        </button>
      </div>

      <StatGrid columns={4}>
        <StatCard
          title="دستگاه‌های آنلاین"
          value={`${onlineCount}/${devicesList.length}`}
          change="实时"
          changeType="up"
          icon={<Cpu size={22} />}
          color="#3b82f6"
        />
        <StatCard
          title="کل تگ‌های فعال"
          value={totalTagCount}
          icon={<Database size={22} />}
          color="#10b981"
        />
        <StatCard
          title="رویدادهای امروز"
          value={liveEvents.length}
          icon={<Activity size={22} />}
          color="#f59e0b"
        />
        <StatCard
          title="فرمول‌های فعال"
          value={formulas.length}
          icon={<GitBranch size={22} />}
          color="#8b5cf6"
        />
      </StatGrid>

      <div className="grid lg:grid-cols-3 gap-4">
        {(loading ? mockTags : liveTags).slice(0, 6).map((tag: any) => {
          const isAlarm =
            tag.alarmEnabled &&
            ((tag.alarmHigh && Number(tag.currentValue) > tag.alarmHigh) ||
              (tag.alarmLow && Number(tag.currentValue) < tag.alarmLow));
          return (
            <div
              key={tag.id || tag.name}
              className={`bg-card border rounded-2xl p-4 transition-all ${isAlarm ? "border-red-500/50" : "border-default"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-muted text-xs">
                    {tag.deviceName || tag.deviceId || ""}
                  </p>
                  <p className="text-primary font-medium">{tag.name}</p>
                </div>
                <div
                  className={`w-2.5 h-2.5 rounded-full ${tag.quality === "good" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                />
              </div>
              <div className="flex items-end gap-1">
                <span
                  className={`text-3xl font-black ${isAlarm ? "text-red-400" : "text-primary"}`}
                >
                  {typeof tag.currentValue === "boolean"
                    ? tag.currentValue
                      ? "ON"
                      : "OFF"
                    : Number(tag.currentValue || 0).toFixed(1)}
                </span>
                <span className="text-muted text-sm mb-1">{tag.unit}</span>
              </div>
              {tag.alarmEnabled && tag.alarmHigh && (
                <div className="mt-2 w-full bg-card rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${isAlarm ? "bg-red-500" : "bg-blue-500"}`}
                    style={{
                      width: `${Math.min(100, (Number(tag.currentValue || 0) / (tag.alarmHigh || tag.max || 1000)) * 100)}%`,
                    }}
                  />
                </div>
              )}
              <p className="text-muted text-[10px] mt-1">
                {tag.timestamp
                  ? new Date(tag.timestamp).toLocaleString("fa-IR")
                  : ""}
              </p>
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
            {["دما", "فشار", "RPM"].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-card px-2 py-1 rounded-lg text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={phase2ChartData.tagTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="time" tick={{ fill: "#71717a", fontSize: 11 }} />
            <YAxis
              yAxisId="temp"
              tick={{ fill: "#71717a", fontSize: 11 }}
              domain={[800, 900]}
            />
            <YAxis
              yAxisId="pressure"
              orientation="right"
              tick={{ fill: "#71717a", fontSize: 11 }}
              domain={[170, 200]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Legend />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="دما (°C)"
            />
            <Line
              yAxisId="pressure"
              type="monotone"
              dataKey="pressure"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="فشار (bar)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-default rounded-2xl p-5">
        <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
          <Zap size={16} className="text-amber-500" /> رویدادهای اخیر
        </h3>
        <div className="space-y-2">
          {(loading ? mockEvents : liveEvents).map((ev: any) => (
            <div
              key={ev.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${ev.acknowledged ? "bg-card" : "bg-card border border-default"}`}
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.type === "alarm" ? "bg-red-500 animate-pulse" : ev.type === "machine_stop" ? "bg-amber-500" : "bg-green-500"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-primary text-sm truncate">{ev.message}</p>
                <p className="text-muted text-xs">
                  {ev.deviceName} •{" "}
                  {ev.timestamp
                    ? new Date(ev.timestamp).toLocaleString("fa-IR")
                    : ""}
                </p>
              </div>
              {ev.acknowledged ? (
                <span className="text-xs text-green-500">تأیید شد</span>
              ) : (
                <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg">
                  تأیید
                </button>
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
      const res = await fetch(`${API}/idp/devices`, {
        headers: apiHeaders(token),
      });
      if (res.ok) setItems(await res.json());
      else setItems(mockDevices as any);
    } catch {
      setItems(mockDevices as any);
    }
    setLoading(false);
  }, [token]);
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const columns: Column<any>[] = [
    {
      key: "name",
      title: "نام دستگاه",
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${row.status === "online" ? "bg-green-500 animate-pulse" : row.status === "warning" ? "bg-amber-500" : "bg-red-500"}`}
          />
          <div>
            <p className="text-primary font-medium">{v}</p>
            <p className="text-muted text-xs">
              {row.brand} {row.model}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      title: "نوع",
      render: (v) => {
        const types: Record<string, string> = {
          plc: "PLC",
          sensor: "سنسور",
          hmi: "HMI",
          drive: "درایو",
          meter: "کنتور",
          camera: "دوربین",
          scale: "ترازو",
          other: "سایر",
        };
        return (
          <span className="text-xs bg-card px-2 py-0.5 rounded">
            {types[v] || v}
          </span>
        );
      },
    },
    {
      key: "ipAddress",
      title: "آدرس IP",
      render: (v) => <span className="font-mono text-blue-400">{v}</span>,
    },
    {
      key: "protocol",
      title: "پروتکل",
      render: (v) => (
        <span
          className="text-xs px-2 py-0.5 rounded font-medium"
          style={{
            backgroundColor: `${protocolColors[v]}20`,
            color: protocolColors[v],
          }}
        >
          {(v || "").toUpperCase().replace("_", " ")}
        </span>
      ),
    },
    { key: "tagCount", title: "تگ‌ها" },
    {
      key: "lastSeen",
      title: "آخرین اتصال",
      render: (v) => (
        <span className="text-xs text-muted">
          {v ? new Date(v).toLocaleString("fa-IR") : ""}
        </span>
      ),
    },
    {
      key: "status",
      title: "وضعیت",
      render: (v) => {
        const s: Record<string, { l: string; c: string }> = {
          online: { l: "آنلاین", c: "text-green-500 bg-green-500/10" },
          offline: { l: "آفلاین", c: "text-red-500 bg-red-500/10" },
          warning: { l: "هشدار", c: "text-amber-500 bg-amber-500/10" },
          error: { l: "خطا", c: "text-red-500 bg-red-500/10" },
        };
        return (
          <span
            className={`px-2 py-0.5 rounded-lg text-xs font-medium ${s[v]?.c}`}
          >
            {s[v]?.l}
          </span>
        );
      },
    },
  ];

  const formFields: FormField[] = [
    { name: "name", label: "نام دستگاه", type: "text", required: true },
    {
      name: "type",
      label: "نوع",
      type: "select",
      required: true,
      options: [
        { value: "plc", label: "PLC" },
        { value: "sensor", label: "سنسور" },
        { value: "hmi", label: "HMI" },
        { value: "drive", label: "درایو" },
        { value: "meter", label: "کنتور" },
        { value: "other", label: "سایر" },
      ],
    },
    { name: "brand", label: "برند", type: "text", required: true },
    { name: "model", label: "مدل", type: "text", required: true },
    { name: "serialNumber", label: "شماره سریال", type: "text" },
    {
      name: "ipAddress",
      label: "آدرس IP",
      type: "text",
      required: true,
      placeholder: "192.168.10.10",
    },
    {
      name: "macAddress",
      label: "آدرس MAC",
      type: "text",
      placeholder: "00:1A:2B:3C:4D:5E",
    },
    {
      name: "protocol",
      label: "پروتکل",
      type: "select",
      required: true,
      options: [
        { value: "opcua", label: "OPC-UA" },
        { value: "mqtt", label: "MQTT" },
        { value: "modbus_tcp", label: "Modbus TCP" },
        { value: "modbus_rtu", label: "Modbus RTU" },
        { value: "ethernet_ip", label: "Ethernet/IP" },
        { value: "profinet", label: "Profinet" },
      ],
    },
    {
      name: "lineId",
      label: "خط تولید",
      type: "select",
      options: [
        { value: "L-001", label: "خط ۱" },
        { value: "L-002", label: "خط ۲" },
        { value: "L-003", label: "خط ۳" },
        { value: "L-004", label: "خط ۴" },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable
        data={loading ? mockDevices : items}
        columns={columns}
        title="ثبت دستگاه‌ها"
        icon={<Cpu size={18} className="text-blue-500" />}
        onAdd={() => setShowModal(true)}
        onEdit={() => setShowModal(true)}
        addLabel="دستگاه جدید"
      />
      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (d) => {
          const res = await fetch(`${API}/idp/devices`, {
            method: "POST",
            headers: apiHeaders(token),
            body: JSON.stringify(d),
          });
          if (res.ok) {
            const created = await res.json();
            setItems((prev) => [...prev, created]);
          }
          setShowModal(false);
        }}
        title="دستگاه جدید"
        fields={formFields}
        size="lg"
      />
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
      const res = await fetch(`${API}/idp/plcs`, {
        headers: apiHeaders(token),
      });
      if (res.ok) setItems(await res.json());
      else setItems(mockPLCs as any);
    } catch {
      setItems(mockPLCs as any);
    }
    setLoading(false);
  }, [token]);
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const plcFormFields: FormField[] = [
    { name: "name", label: "نام PLC", type: "text", required: true },
    {
      name: "brand",
      label: "برند",
      type: "select",
      required: true,
      options: [
        { value: "siemens", label: "Siemens" },
        { value: "mitsubishi", label: "Mitsubishi" },
        { value: "delta", label: "Delta" },
        { value: "omron", label: "Omron" },
        { value: "allen_bradley", label: "Allen-Bradley" },
        { value: "schneider", label: "Schneider" },
        { value: "ls", label: "LS" },
        { value: "fatek", label: "Fatek" },
      ],
    },
    { name: "model", label: "مدل", type: "text", required: true },
    {
      name: "ipAddress",
      label: "آدرس IP",
      type: "text",
      required: true,
      placeholder: "192.168.10.10",
    },
    { name: "rack", label: "Rack", type: "number", required: true },
    { name: "slot", label: "Slot", type: "number", required: true },
    {
      name: "protocol",
      label: "پروتکل",
      type: "select",
      required: true,
      options: [
        { value: "OPC-UA", label: "OPC-UA" },
        { value: "Modbus TCP", label: "Modbus TCP" },
        { value: "Modbus RTU", label: "Modbus RTU" },
        { value: "Ethernet/IP", label: "Ethernet/IP" },
      ],
    },
    {
      name: "scanRate",
      label: "Scan Rate (ms)",
      type: "number",
      required: true,
    },
    {
      name: "lineId",
      label: "خط تولید",
      type: "select",
      options: [
        { value: "L-001", label: "خط ۱" },
        { value: "L-002", label: "خط ۲" },
        { value: "L-003", label: "خط ۳" },
        { value: "L-004", label: "خط ۴" },
      ],
    },
  ];

  const columns: Column<any>[] = [
    {
      key: "name",
      title: "نام PLC",
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={{
              backgroundColor: plcBrandColors[row.brand]?.bg,
              color: plcBrandColors[row.brand]?.text,
            }}
          >
            {(row.brand || "").toUpperCase()}
          </span>
          <span className="text-primary">{v}</span>
        </div>
      ),
    },
    { key: "model", title: "مدل" },
    {
      key: "ipAddress",
      title: "IP",
      render: (v) => <span className="font-mono text-blue-400">{v}</span>,
    },
    { key: "rack", title: "Rack" },
    { key: "slot", title: "Slot" },
    {
      key: "protocol",
      title: "پروتکل",
      render: (v) => (
        <span className="text-xs bg-card px-2 py-0.5 rounded">{v}</span>
      ),
    },
    { key: "scanRate", title: "Scan Rate", render: (v) => `${v}ms` },
    { key: "tagCount", title: "تگ‌ها" },
    {
      key: "status",
      title: "وضعیت",
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${v === "connected" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          />
          <span
            className={`text-xs ${v === "connected" ? "text-green-500" : "text-red-500"}`}
          >
            {v === "connected" ? "متصل" : "قطع"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 p-4 bg-card border border-default rounded-2xl">
        <p className="text-muted text-xs col-span-full mb-1">
          برندهای پشتیبانی شده
        </p>
        {Object.entries(plcBrandColors).map(([brand, colors]) => (
          <div key={brand} className="text-center">
            <div
              className="w-full py-2 rounded-lg text-[10px] font-bold"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {brand === "allen_bradley"
                ? "A-B"
                : brand.charAt(0).toUpperCase() + brand.slice(1)}
            </div>
          </div>
        ))}
      </div>
      <DataTable
        data={loading ? mockPLCs : items}
        columns={columns}
        title="مدیریت PLC"
        icon={<Database size={18} className="text-purple-500" />}
        onAdd={() => setShowModal(true)}
        addLabel="PLC جدید"
      />
      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (d) => {
          const payload = {
            ...d,
            type: "plc",
            rack: Number(d.rack),
            slot: Number(d.slot),
            scanRate: Number(d.scanRate),
          };
          const res = await fetch(`${API}/idp/devices`, {
            method: "POST",
            headers: apiHeaders(token),
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const created = await res.json();
            setItems((prev) => [...prev, created]);
          }
          setShowModal(false);
        }}
        title="PLC جدید"
        fields={plcFormFields}
        size="lg"
      />
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
        fetch(`${API}/idp/tags`, { headers: apiHeaders(token) }).then((r) =>
          r.ok ? r.json() : Promise.reject(),
        ),
        fetch(`${API}/idp/devices`, { headers: apiHeaders(token) }).then((r) =>
          r.ok ? r.json() : Promise.reject(),
        ),
      ]);
      setItems(tagsRes);
      setDevicesList(devRes);
    } catch {
      setItems(mockTags as any);
      setDevicesList(mockDevices as any);
    }
    setLoading(false);
  }, [token]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deviceOptions = devicesList.map((d: any) => ({
    value: d.id,
    label: d.name,
  }));

  const tagFormFields: FormField[] = [
    { name: "name", label: "نام تگ", type: "text", required: true },
    {
      name: "address",
      label: "آدرس",
      type: "text",
      required: true,
      placeholder: "DB100.DBD0",
    },
    {
      name: "tagType",
      label: "نوع تگ",
      type: "select",
      required: true,
      options: [
        { value: "temperature", label: "دما" },
        { value: "pressure", label: "فشار" },
        { value: "speed", label: "سرعت" },
        { value: "rpm", label: "RPM" },
        { value: "current", label: "جریان" },
        { value: "voltage", label: "ولتاژ" },
        { value: "counter", label: "شمارنده" },
        { value: "status", label: "وضعیت" },
        { value: "alarm", label: "هشدار" },
        { value: "humidity", label: "رطوبت" },
        { value: "weight", label: "وزن" },
      ],
    },
    {
      name: "unit",
      label: "واحد",
      type: "text",
      required: true,
      placeholder: "°C, bar, RPM, ...",
    },
    {
      name: "dataType",
      label: "نوع داده",
      type: "select",
      required: true,
      options: [
        { value: "bool", label: "Bool" },
        { value: "int", label: "Integer" },
        { value: "float", label: "Float" },
      ],
    },
    {
      name: "deviceId",
      label: "دستگاه",
      type: "select",
      required: true,
      options: deviceOptions,
    },
    { name: "alarmEnabled", label: "فعالسازی هشدار", type: "checkbox" },
    { name: "alarmHigh", label: "هشدار بالا", type: "number" },
    { name: "alarmLow", label: "هشدار پایین", type: "number" },
  ];

  const columns: Column<any>[] = [
    { key: "name", title: "نام تگ" },
    {
      key: "address",
      title: "آدرس",
      render: (v) => (
        <span className="font-mono text-xs text-blue-400">{v}</span>
      ),
    },
    {
      key: "tagType",
      title: "نوع",
      render: (v) => {
        const icons: Record<string, string> = {
          temperature: "🌡️",
          pressure: "📊",
          rpm: "⚙️",
          current: "⚡",
          voltage: "🔋",
          counter: "🔢",
          status: "🔘",
          alarm: "🚨",
          humidity: "💧",
          speed: "🏃",
          weight: "⚖️",
        };
        return (
          <span>
            {icons[v] || "📌"} {v}
          </span>
        );
      },
    },
    { key: "unit", title: "واحد" },
    {
      key: "currentValue",
      title: "مقدار فعلی",
      render: (v, row) => {
        const isAlarm =
          row.alarmEnabled && row.alarmHigh && Number(v) > row.alarmHigh;
        return (
          <span
            className={`font-bold ${isAlarm ? "text-red-400" : "text-primary"}`}
          >
            {typeof v === "boolean"
              ? v
                ? "ON"
                : "OFF"
              : `${Number(v || 0).toFixed(1)} ${row.unit}`}
          </span>
        );
      },
    },
    {
      key: "quality",
      title: "کیفیت",
      render: (v) => (
        <span
          className={`text-xs ${v === "good" ? "text-green-500" : v === "bad" ? "text-red-500" : "text-amber-500"}`}
        >
          {v === "good" ? "✓ خوب" : v === "bad" ? "✗ بد" : "? نامشخص"}
        </span>
      ),
    },
    {
      key: "deviceName",
      title: "دستگاه",
      render: (v) => <span className="text-xs text-secondary">{v || ""}</span>,
    },
    {
      key: "alarmEnabled",
      title: "هشدار",
      render: (v) =>
        v ? (
          <CheckCircle2 size={14} className="text-green-500" />
        ) : (
          <span className="text-muted">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable
        data={loading ? mockTags : items}
        columns={columns}
        title="مدیریت تگ‌ها"
        icon={<Database size={18} className="text-green-500" />}
        onAdd={() => setShowModal(true)}
        onView={(t) => setSelectedTag(t)}
        addLabel="تگ جدید"
      />
      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (d) => {
          const payload = {
            ...d,
            alarmEnabled: d.alarmEnabled === true || d.alarmEnabled === "true",
            alarmHigh: d.alarmHigh ? Number(d.alarmHigh) : undefined,
            alarmLow: d.alarmLow ? Number(d.alarmLow) : undefined,
            currentValue: 0,
            quality: "good",
          };
          const res = await fetch(`${API}/idp/tags`, {
            method: "POST",
            headers: apiHeaders(token),
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const created = await res.json();
            setItems((prev) => [...prev, created]);
          }
          setShowModal(false);
        }}
        title="تگ جدید"
        fields={tagFormFields}
        size="lg"
      />

      {selectedTag && (
        <div className="bg-card border border-default rounded-2xl p-5">
          <h3 className="text-primary font-bold mb-4">
            جزئیات تگ: {selectedTag.name}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-muted text-xs">آدرس</span>
              <p className="text-primary font-mono">{selectedTag.address}</p>
            </div>
            <div>
              <span className="text-muted text-xs">بازه</span>
              <p className="text-primary">
                {selectedTag.min || 0} - {selectedTag.max || 100}{" "}
                {selectedTag.unit}
              </p>
            </div>
            <div>
              <span className="text-muted text-xs">Deadband</span>
              <p className="text-primary">{selectedTag.deadband || 0}</p>
            </div>
            <div>
              <span className="text-muted text-xs">Scan Rate</span>
              <p className="text-primary">{selectedTag.scanRate || 1000}ms</p>
            </div>
            {selectedTag.alarmHigh && (
              <div>
                <span className="text-muted text-xs">هشدار بالا</span>
                <p className="text-red-400">
                  {selectedTag.alarmHigh} {selectedTag.unit}
                </p>
              </div>
            )}
            {selectedTag.alarmLow && (
              <div>
                <span className="text-muted text-xs">هشدار پایین</span>
                <p className="text-blue-400">
                  {selectedTag.alarmLow} {selectedTag.unit}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HistorianPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  /** Map: raw sensor id → display name from config */
  const [sensorLabelMap, setSensorLabelMap] = useState<Record<string, string>>(
    {},
  );
  const [selectedSensor, setSelectedSensor] = useState(
    "line02.plc01.motor-mixer.current",
  );
  const [selectedRange, setSelectedRange] = useState("-1h");
  const [chartData, setChartData] = useState<
    { time: string; label: string; value: number }[]
  >([]);
  const [selectedWindow, setSelectedWindow] = useState("5m");
  const [loading, setLoading] = useState(false);

  /** Derive the display label for the currently selected sensor */
  const selectedSensorLabel = sensorLabelMap[selectedSensor] || selectedSensor;

  useEffect(() => {
    loadSensors();
  }, []);

  useEffect(() => {
    if (!selectedSensor) return;

    loadReadings();
  }, [selectedSensor, selectedRange, selectedWindow]);

  const loadSensors = async () => {
    try {
      const [sensorData, configs] = await Promise.all([
        telemetryService.getSensors(),
        telemetryService.getConfigs().catch(() => [] as SensorConfig[]),
      ]);
      setSensors(sensorData);

      // Build a lookup: sensor_id → display name (fall back to raw id)
      const labelMap: Record<string, string> = {};
      for (const c of configs) {
        if (c.name) {
          labelMap[c.sensor_id] = c.name;
        }
      }
      setSensorLabelMap(labelMap);

      if (sensorData.length > 0) {
        setSelectedSensor(sensorData[0].sensor);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadReadings = async () => {
    try {
      setLoading(true);

      const data = await telemetryService.getReadings({
        sensor: selectedSensor,
        start: selectedRange,
        window: selectedWindow,
      });

      // Use the full ISO timestamp as x-value so every point has a unique
      // x-coordinate (fixes activeDot alignment on multi-day ranges where
      // HH:mm alone creates duplicate values). The tick formatter on XAxis
      // will display short labels.
      const formatted = data.points.map((point) => ({
        time: point.time, // full ISO string — unique per data point
        label: point.time.split("T")[1].slice(0, 5), // "14:35" display label
        value: point.value,
      }));
      setChartData(formatted);
    } catch (err) {
      console.error(err);
      // If the selected sensor fails, try skipping to the next one
      if (sensors.length > 0) {
        const currentIdx = sensors.findIndex(
          (s) => s.sensor === selectedSensor,
        );
        const nextIdx = currentIdx + 1;
        if (nextIdx < sensors.length) {
          setSelectedSensor(sensors[nextIdx].sensor);
          return;
        }
      }
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-primary">
          تاریخچه داده (Historian)
        </h1>
        <p className="text-muted text-sm">
          نمایش و تحلیل داده‌های تاریخی تگ‌ها
        </p>
      </div>
      <div className="bg-card border border-default rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="bg-card border border-default rounded-xl px-3 py-2 text-primary text-sm"
          >
            {sensors.map((sensor) => {
              const label = sensorLabelMap[sensor.sensor] || sensor.sensor;
              return (
                <option key={sensor.sensor} value={sensor.sensor}>
                  {label}
                </option>
              );
            })}
          </select>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-card border border-default rounded-xl px-3 py-2 text-primary text-sm"
          >
            <option value="-1h">1 Hour</option>
            <option value="-24h">24 Hours</option>
            <option value="-7d">7 Days</option>
            <option value="-30d">30 Days</option>
          </select>
          <select
            value={selectedWindow}
            onChange={(e) => setSelectedWindow(e.target.value)}
            className="bg-card border border-default rounded-xl px-3 py-2 text-primary text-sm"
          >
            <option value="3m">3 Minutes</option>
            <option value="5m">5 Minutes</option>
            <option value="10m">10 Minutes</option>
            <option value="15m">15 Minutes</option>
          </select>
          {selectedSensorLabel !== selectedSensor && (
            <span className="text-xs text-muted bg-card px-2 py-1 rounded-lg">
              {selectedSensor}
            </span>
          )}
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              tabIndex={-1}
              style={{ outline: "none" }}
            >
              <defs>
                <linearGradient id="gradHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="time"
                tickFormatter={(val: string) => {
                  const d = new Date(val);
                  // Show date for ranges > 24h, else just time
                  const rangeMs =
                    chartData.length > 1
                      ? new Date(chartData[chartData.length - 1].time).getTime() -
                        new Date(chartData[0].time).getTime()
                      : 0;
                  if (rangeMs > 86400000) {
                    return d.toLocaleDateString("fa-IR", {
                      month: "short",
                      day: "numeric",
                    });
                  }
                  return d.toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }}
                tick={{ fill: "#71717a", fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "12px",
                }}
                labelFormatter={(_label: string, payload: any[]) => {
                  const point = payload?.[0]?.payload;
                  return point
                    ? `${selectedSensorLabel} — ${point.label}`
                    : selectedSensorLabel;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                fill="url(#gradHist)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#ef4444",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

interface SensorConfigDraft {
  name: string;
  name_en: string;
  unit: string;
  description: string;
  is_active: boolean;
}

interface MergedSensorRow {
  /** The canonical sensor identifier (maps to sensor.sensor or sensor_id) */
  sensorId: string;
  /** Whether this sensor has been saved as a config on the backend */
  hasConfig: boolean;
  /** Server-side config id (0 if no config yet) */
  configId: number;
  /** Display name from config, or empty string */
  name: string;
  name_en: string;
  /** Unit from config, or blank */
  unit: string;
  description: string;
  is_active: boolean;
}

function SensorConfigPage() {
  const user = useAuthStore((s) => s.user);
  const factoryId = user?.factory ?? 1;

  const [rows, setRows] = useState<MergedSensorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingRow, setEditingRow] = useState<Record<string, SensorConfigDraft>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both discovered sensors AND existing configs in parallel
      const [sensors, configs] = await Promise.all([
        telemetryService.getSensors(),
        telemetryService.getConfigs(),
      ]);

      // Build a lookup: sensorId → SensorConfig
      const configMap = new Map<string, SensorConfig>();
      for (const c of configs) {
        configMap.set(c.sensor_id, c);
      }

      // Merge: every discovered sensor gets a row; config info fills in if available
      const merged: MergedSensorRow[] = sensors.map((s) => {
        const existing = configMap.get(s.sensor);
        return {
          sensorId: s.sensor,
          hasConfig: !!existing,
          configId: existing?.id ?? 0,
          name: existing?.name ?? "",
          name_en: existing?.name_en ?? "",
          unit: existing?.unit ?? "",
          description: existing?.description ?? "",
          is_active: existing?.is_active ?? true,
        };
      });

      setRows(merged);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "خطا در دریافت تنظیمات سنسورها";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getRow = (sensorId: string): MergedSensorRow | undefined =>
    rows.find((r) => r.sensorId === sensorId);

  const startEdit = (sensorId: string) => {
    const row = getRow(sensorId);
    if (!row) return;
    setEditingRow((prev) => ({
      ...prev,
      [sensorId]: {
        name: row.name,
        name_en: row.name_en,
        unit: row.unit,
        description: row.description,
        is_active: row.is_active,
      },
    }));
  };

  const cancelEdit = (sensorId: string) => {
    setEditingRow((prev) => {
      const next = { ...prev };
      delete next[sensorId];
      return next;
    });
  };

  const updateDraft = (sensorId: string, field: keyof SensorConfigDraft, value: any) => {
    setEditingRow((prev) => ({
      ...prev,
      [sensorId]: { ...prev[sensorId], [field]: value },
    }));
  };

  const handleSave = async (sensorId: string) => {
    const draft = editingRow[sensorId];
    if (!draft) return;

    // Validate
    if (!draft.name.trim()) {
      toast.error("نام سنسور الزامی است");
      return;
    }
    if (!draft.unit.trim()) {
      toast.error("واحد اندازه‌گیری الزامی است");
      return;
    }

    const payload = {
      sensor_id: sensorId,
      name: draft.name.trim(),
      name_en: draft.name_en.trim() || draft.name.trim(),
      unit: draft.unit.trim(),
      description: draft.description.trim(),
      factory: factoryId,
      is_active: draft.is_active,
    };

    setSaving((prev) => ({ ...prev, [sensorId]: true }));

    try {
      const row = getRow(sensorId);
      if (row?.hasConfig && row.configId > 0) {
        // UPDATE
        const updated = await telemetryService.updateConfig(row.configId, payload);
        setRows((prev) =>
          prev.map((r) =>
            r.sensorId === sensorId
              ? { ...r, name: updated.name, name_en: updated.name_en, unit: updated.unit, description: updated.description, is_active: updated.is_active }
              : r,
          ),
        );
        toast.success("تنظیمات سنسور با موفقیت به‌روزرسانی شد");
      } else {
        // CREATE
        const created = await telemetryService.createConfig(payload);
        setRows((prev) =>
          prev.map((r) =>
            r.sensorId === sensorId
              ? {
                  ...r,
                  hasConfig: true,
                  configId: created.id,
                  name: created.name,
                  name_en: created.name_en,
                  unit: created.unit,
                  description: created.description,
                  is_active: created.is_active,
                }
              : r,
          ),
        );
        toast.success("تنظیمات سنسور با موفقیت ایجاد شد");
      }
      cancelEdit(sensorId);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "خطا در ذخیره تنظیمات";
      toast.error(msg);
    } finally {
      setSaving((prev) => ({ ...prev, [sensorId]: false }));
    }
  };

  // ── Render ──
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">تنظیمات سنسور</h1>
            <p className="text-muted text-sm">مدیریت نام و واحد سنسورهای PLC</p>
          </div>
        </div>
        <div className="bg-card border border-default rounded-2xl p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-muted" />
          <p className="text-muted">در حال دریافت اطلاعات سنسورها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">تنظیمات سنسور</h1>
            <p className="text-muted text-sm">مدیریت نام و واحد سنسورهای PLC</p>
          </div>
          <button
            onClick={loadConfigs}
            className="flex items-center gap-1.5 px-4 py-2 bg-card hover:bg-zinc-700 text-primary text-sm rounded-xl transition-all"
          >
            <RefreshCw size={14} />
            تلاش مجدد
          </button>
        </div>
        <div className="bg-card border border-red-500/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">تنظیمات سنسور</h1>
          <p className="text-muted text-sm">
            برای هر سنسور نام و واحد اندازه‌گیری دلخواه تعیین کنید
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-2 bg-card hover:bg-zinc-700 text-primary text-sm rounded-xl transition-all"
        >
          <RefreshCw size={14} />
          بروزرسانی
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="bg-card border border-default rounded-2xl p-12 flex flex-col items-center justify-center gap-3">
          <Gauge size={40} className="text-muted" />
          <p className="text-muted">هیچ سنسوری یافت نشد</p>
          <p className="text-muted text-xs">
            پس از راه‌اندازی PLCها و تشخیص سنسورها، در این بخش نمایش داده خواهند شد
          </p>
        </div>
      ) : (
        <div className="bg-card border border-default rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-default bg-card">
                  <th className="text-right text-xs font-medium text-muted px-4 py-3">
                    شناسه سنسور
                  </th>
                  <th className="text-right text-xs font-medium text-muted px-4 py-3">
                    نام نمایشی
                  </th>
                  <th className="text-right text-xs font-medium text-muted px-4 py-3">
                    واحد
                  </th>
                  <th className="text-right text-xs font-medium text-muted px-4 py-3">
                    توضیحات
                  </th>
                  <th className="text-right text-xs font-medium text-muted px-4 py-3">
                    وضعیت
                  </th>
                  <th className="text-right text-xs font-medium text-muted px-4 py-3 w-32">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const sid = row.sensorId;
                  const isEditing = sid in editingRow;
                  const draft = editingRow[sid];
                  const isSaving = saving[sid] ?? false;

                  return (
                    <tr
                      key={sid}
                      className="border-b border-default hover:bg-card/50 transition-colors"
                    >
                      {/* Sensor ID (readonly) */}
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-blue-400">
                          {sid}
                        </code>
                      </td>

                      {/* Name (editable) */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={draft.name}
                            onChange={(e) =>
                              updateDraft(sid, "name", e.target.value)
                            }
                            className="w-full bg-card border border-default rounded-lg px-3 py-1.5 text-sm text-primary placeholder:text-muted outline-none focus:border-blue-500 transition-colors"
                            placeholder="نام فارسی"
                            disabled={isSaving}
                          />
                        ) : (
                          <span className="text-sm text-primary">
                            {row.name || "—"}
                          </span>
                        )}
                      </td>

                      {/* Unit (editable) */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={draft.unit}
                            onChange={(e) =>
                              updateDraft(sid, "unit", e.target.value)
                            }
                            className="w-full bg-card border border-default rounded-lg px-3 py-1.5 text-sm text-primary placeholder:text-muted outline-none focus:border-blue-500 transition-colors"
                            placeholder="مثلاً A, °C, bar"
                            disabled={isSaving}
                            dir="ltr"
                          />
                        ) : (
                          <span className="text-sm text-primary">
                            {row.unit || "—"}
                          </span>
                        )}
                      </td>

                      {/* Description (editable) */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={draft.description}
                            onChange={(e) =>
                              updateDraft(sid, "description", e.target.value)
                            }
                            className="w-full bg-card border border-default rounded-lg px-3 py-1.5 text-sm text-primary placeholder:text-muted outline-none focus:border-blue-500 transition-colors"
                            placeholder="توضیحات (اختیاری)"
                            disabled={isSaving}
                          />
                        ) : (
                          <span className="text-sm text-muted">
                            {row.description || "—"}
                          </span>
                        )}
                      </td>

                      {/* Status (Active/Inactive — editable when editing) */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={draft.is_active}
                              onChange={(e) =>
                                updateDraft(sid, "is_active", e.target.checked)
                              }
                              className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-600 focus:ring-blue-500"
                              disabled={isSaving}
                            />
                            <span className="text-xs text-primary">
                              {draft.is_active ? "فعال" : "غیرفعال"}
                            </span>
                          </label>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                              row.is_active
                                ? "text-green-500 bg-green-500/10"
                                : "text-red-500 bg-red-500/10"
                            }`}
                          >
                            {row.is_active ? "فعال" : "غیرفعال"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSave(sid)}
                              disabled={isSaving}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-all"
                            >
                              {isSaving ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Save size={12} />
                              )}
                              ذخیره
                            </button>
                            <button
                              onClick={() => cancelEdit(sid)}
                              disabled={isSaving}
                              className="flex items-center gap-1 px-3 py-1.5 text-muted hover:text-primary hover:bg-card rounded-lg text-xs transition-all"
                            >
                              <X size={12} />
                              لغو
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(sid)}
                            className="flex items-center gap-1 px-3 py-1.5 text-muted hover:text-amber-500 hover:bg-amber-500/10 rounded-lg text-xs transition-all"
                          >
                            <Database size={12} />
                            ویرایش
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Row count */}
          <div className="p-3 border-t border-default">
            <span className="text-xs text-muted">
              {rows.length} سنسور
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function FormulasPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Formula Builder</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">
          <Plus size={16} /> فرمول جدید
        </button>
      </div>
      <div className="space-y-4">
        {formulas.map((f) => (
          <div
            key={f.id}
            className="bg-card border border-default rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-primary font-bold">{f.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-blue-400">
                  {typeof f.lastValue === "number" && f.lastValue > 1000
                    ? f.lastValue.toLocaleString()
                    : f.lastValue}{" "}
                  {f.unit}
                </span>
              </div>
            </div>
            <code className="block bg-card rounded-xl px-4 py-3 text-green-400 text-sm font-mono mb-3">
              {f.expression}
            </code>
            <div className="flex items-center gap-2">
              <span className="text-muted text-xs">تگ‌های وابسته:</span>
              {f.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-card text-secondary px-2 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-muted text-xs mt-2">
              آخرین محاسبه: {f.lastCalculated}
            </p>
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
      const res = await fetch(`${API}/idp/events?limit=50`, {
        headers: apiHeaders(token),
      });
      if (res.ok) setItems(await res.json());
      else setItems(mockEvents as any);
    } catch {
      setItems(mockEvents as any);
    }
    setLoading(false);
  }, [token]);
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
            <div
              key={ev.id}
              className="px-4 py-3 hover:bg-card transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ev.type === "alarm" ? "bg-red-500" : ev.type === "machine_stop" ? "bg-amber-500" : ev.type === "batch_start" ? "bg-blue-500" : "bg-green-500"}`}
                />
                <div className="flex-1">
                  <p className="text-primary text-sm">{ev.message}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {ev.deviceName} •{" "}
                    {ev.timestamp
                      ? new Date(ev.timestamp).toLocaleString("fa-IR")
                      : ""}
                  </p>
                  {ev.value !== undefined && (
                    <p className="text-secondary text-xs">
                      مقدار: {String(ev.value)}
                    </p>
                  )}
                </div>
                {ev.acknowledged ? (
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5" />
                ) : (
                  <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded">
                    تأیید
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
