import { useState, useEffect } from "react";
import axios from "axios";
import moment from "jalali-moment";
import {
  Building2,
  Key,
  Package,
  Store,
  Activity,
  Cpu,
  Users,
  DollarSign,
  LayoutDashboard,
  Plus,
  FlaskConical,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import DataTable, { Column } from "@/components/ui/DataTable";
import FormModal, { FormField } from "@/components/ui/FormModal";
import StatCard, { StatGrid } from "@/components/ui/StatCard";
import { customPages as initialPages, FactoryData } from "@/data/tenantData";
import { modules } from "@/data/modules";
import type {
  CustomPage,
  CustomPageField,
  CustomPageCategory,
} from "@/types/tenant";
import { factoryService } from "@/services/factoryService";
import { factoryMetaService } from "@/services/factoryMetaService";

const catIcons: Record<CustomPageCategory, any> = {
  plc: Cpu,
  lab: FlaskConical,
  form: FileText,
  dashboard: LayoutDashboard,
};
const catColors: Record<CustomPageCategory, string> = {
  plc: "#06b6d4",
  lab: "#a855f7",
  form: "#84cc16",
  dashboard: "#3b82f6",
};
const catLabels: Record<CustomPageCategory, string> = {
  plc: "PLC",
  lab: "آزمایشگاه",
  form: "فرم",
  dashboard: "داشبورد",
};

export function SuperAdminModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  switch (currentPage) {
    case "tenants":
      return <TenantsPage />;
    // case "modules":
    //   return <ModulesPage />;
    // case "health":
    //   return <HealthPage />;
    // case "marketplace":
    //   return <MarketplacePage />;
    default:
      return <SuperAdminDashboard onNavigate={setCurrentPage} />;
  }
}

function SuperAdminDashboard({
  onNavigate,
}: {
  onNavigate: (p: string) => void;
}) {
  const [factories, setFactories] = useState<FactoryData[]>([]);

  useEffect(() => {
    const loadFactories = async () => {
      try {
        const data = await factoryService.getFactories();
        setFactories(data ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    loadFactories();
  }, []);
  const activeCount = factories.filter((f) => f.status === "active").length;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            پنل مدیریت ارشد FactoryOS
          </h1>
          <p className="text-zinc-500">
            مدیریت چند-کارخانه‌ای (Multi-Tenant) — لایسنس، ماژول‌ها، صفحات
            سفارشی
          </p>
        </div>
      </div>
      <StatGrid columns={4}>
        <StatCard
          title="کارخانه‌های فعال"
          value={activeCount}
          unit={`از ${factories.length}`}
          icon={<Building2 size={22} />}
          color="#3b82f6"
        />
        <StatCard
          title="مجموع کاربران"
          value="۱,۲۴۰"
          unit="نفر"
          change="+۸۹ این ماه"
          changeType="up"
          icon={<Users size={22} />}
          color="#10b981"
        />
        <StatCard
          title="لایسنس‌های فعال"
          value={factories.filter((f) => f.is_license_valid).length}
          unit={`از ${factories.length}`}
          icon={<Key size={22} />}
          color="#a855f7"
        />
        <StatCard
          title="درآمد ماهانه"
          value="۲.۴B"
          unit="ریال"
          icon={<DollarSign size={22} />}
          color="#f59e0b"
        />
      </StatGrid>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "مدیریت کارخانه‌ها",
            icon: Building2,
            color: "#3b82f6",
            page: "tenants",
            desc: "ایجاد و ویرایش کارخانه‌های مشتری",
          },
          {
            title: "فعال‌سازی ماژول",
            icon: Package,
            color: "#8b5cf6",
            page: "modules",
            desc: "تنظیم ماژول‌های هر کارخانه",
          },
          {
            title: "سلامت سیستم",
            icon: Activity,
            color: "#10b981",
            page: "health",
            desc: "مانیتورینگ سرورها",
          },
          {
            title: "مارکت‌پلیس",
            icon: Store,
            color: "#ec4899",
            page: "marketplace",
            desc: "افزونه‌ها و پک‌ها",
          },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 text-center transition-all group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <p className="text-white text-sm font-medium">{item.title}</p>
            <p className="text-zinc-600 text-xs mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-3">لایسنس‌های منقضی نزدیک</h3>
        <div className="space-y-2">
          {factories
            .filter(
              (f) =>
                new Date(f.expiration_date).getTime() - Date.now() <
                7 * 24 * 60 * 60 * 1000,
            )
            .map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between bg-zinc-800/40 rounded-xl p-3"
              >
                <span className="text-white text-sm">{f.name}</span>

                <span className="text-zinc-400 text-xs font-mono">
                  {f.license_id}
                </span>

                <span className="text-amber-400 text-xs">
                  انقضا: {moment(f.expiration_date).format("YYYY/MM/DD")}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function TenantsPage() {
  // const [licenses, setLicenses] = useState(initialLicenses);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FactoryData | null>(null);
  const [viewing, setViewing] = useState<FactoryRow | null>(null);
  const [localFactories, setLocalFactories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFactory, setExpandedFactory] = useState<string | null>(null);
  const [choices, setChoices] = useState<any>(null);
  const [loadingChoices, setLoadingChoices] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await factoryMetaService.getChoices();
        setChoices(data);
      } finally {
        setLoadingChoices(false);
      }
    };

    load();
  }, []);
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await factoryService.getFactories();
        setLocalFactories(data ?? []);
        console.log(localFactories);
      } catch (err) {
        console.error("Failed to load factories:", err);
        setLocalFactories([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  type FactoryData = {
    id: number;
    code: string;
    name: string;
    owner_name: string;
    owner_mobile: string;
    owner_email: string;
    address: string;
    industry: string;
    city: string;
    plan: string;
    status: string;
    user_limit: number;
    expiration_date: string;
    enabledModules?: string[];
  };

  type FactoryRow = {
    id: string;
    code: string;
    name: string;
    ownerName: string;
    ownerMobile: string;
    ownerEmail: string;
    address: string;
    industry: string;
    city: string;
    plan: string;
    status: string;
    userLimit: number;
    expiresAt: string;
    enabledModules: string[];
  };

  const mapFactory = (f: FactoryData): FactoryRow => ({
    id: String(f.id),
    code: f.code,
    name: f.name,
    ownerName: f.owner_name,
    ownerMobile: f.owner_mobile,
    ownerEmail: f.owner_email,
    address: f.address,
    industry: f.industry,
    city: f.city,
    plan: f.plan,
    status: f.status,
    userLimit: f.user_limit,
    expiresAt: moment(f.expiration_date).locale("fa").format("YYYY/MM/DD"),
    enabledModules: f.enabledModules ?? [],
  });

  const normalizedFactories = localFactories.map(mapFactory);
  console.log("normalizedFactories:", normalizedFactories);

  const safeChoices = choices ?? {
    industry: [],
    plan: [],
    status: [],
  };

  const toEnglishDigits = (str?: string) =>
    (str || "").replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

  const convertDate = (jalaliDate?: string) => {
    if (!jalaliDate) return null;

    return moment
      .from(toEnglishDigits(jalaliDate), "fa", "YYYY/MM/DD")
      .format("YYYY-MM-DDTHH:mm:ss[Z]");
  };

  const columns: Column<FactoryRow>[] = [
    {
      key: "code",
      title: "کد",
      render: (v) => <span className="font-mono text-blue-400">{v}</span>,
    },
    {
      key: "name",
      title: "نام کارخانه",
      render: (_, row) => (
        <div>
          <p className="text-white">{row.name}</p>
          <p className="text-zinc-500 text-xs">{row.industry}</p>
        </div>
      ),
    },
    { key: "ownerName", title: "مالک" },
    { key: "city", title: "شهر" },
    {
      key: "plan",
      title: "پلن",
      render: (v) => {
        const plans: Record<string, { name: string; color: string }> = {
          trial: {
            name: "Trial",
            color: "#6b7280",
          },
          professional: {
            name: "Professional",
            color: "#3b82f6",
          },
          enterprise: {
            name: "Enterprise",
            color: "#f59e0b",
          },
        };

        const p = plans[v] || {
          name: v ?? "-",
          color: "#6b7280",
        };

        return (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${p.color}20`,
              color: p.color,
            }}
          >
            {p.name}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "وضعیت",
      render: (v) => {
        const s: { label: string; color: string } =
          v === "active"
            ? { label: "فعال", color: "#10b981" }
            : v === "trial"
              ? { label: "آزمایشی", color: "#f59e0b" }
              : v === "suspended"
                ? { label: "تعلیق", color: "#ef4444" }
                : { label: "منقضی", color: "#6b7280" };
        return (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: `${s.color}20`, color: s.color }}
          >
            {s.label}
          </span>
        );
      },
    },
    { key: "expiresAt", title: "انقضا" },
  ];

  const formFields: FormField[] = [
    { name: "name", label: "نام کارخانه", type: "text", required: true },
    { name: "code", label: "شناسه ملی", type: "text", required: true },
    {
      name: "industry",
      label: "صنعت",
      type: "select",
      required: true,
      options: loadingChoices ? [] : safeChoices.industry,
    },
    { name: "ownerName", label: "نام مالک", type: "text", required: true },
    { name: "userLimit", label: "سقف کاربر", type: "text", required: true },
    { name: "expiresAt", label: "تاریخ انقضا", type: "date", required: true },
    { name: "ownerMobile", label: "موبایل مالک", type: "tel", required: true },
    { name: "city", label: "شهر", type: "text", required: true },
    { name: "address", label: "آدرس", type: "textarea", colSpan: 2 },
    { name: "ownerEmail", label: "ایمیل مالک", type: "email" },
    {
      name: "plan",
      label: "پلن",
      type: "select",
      options: loadingChoices ? [] : safeChoices.plan,
    },
    {
      name: "status",
      label: "وضعیت",
      type: "select",
      options: loadingChoices ? [] : safeChoices.status,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">مدیریت لایسنس‌ها</h1>
          <p className="text-zinc-500 text-sm">
            صدور و مدیریت کلیدهای مجوز برای هر کارخانه
          </p>
        </div>
      </div>
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[
          { label: "کل لایسنس‌ها", value: licenses.length, color: "#3b82f6" },
          {
            label: "فعال",
            value: licenses.filter((l) => l.status === "active").length,
            color: "#10b981",
          },
          {
            label: "منقضی",
            value: licenses.filter((l) => l.status === "expired").length,
            color: "#ef4444",
          },
          {
            label: "کارخانه تحت پوشش",
            value: new Set(licenses.map((l) => l.tenantId)).size,
            color: "#f59e0b",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div> */}
      <div>
        <h1 className="text-xl font-bold text-white">
          مدیریت کارخانه‌ها (Tenants)
        </h1>
        <p className="text-zinc-500 text-sm">ایجاد و مدیریت مشتریان صنعتی</p>
      </div>
      <DataTable<FactoryRow>
        data={normalizedFactories}
        columns={columns}
        title="لیست کارخانه‌ها"
        icon={<Building2 size={18} className="text-blue-500" />}
        onAdd={() => {
          setEditing(null);
          setShowModal(true);
        }}
        onEdit={(t: any) => {
          setEditing(t);
          setShowModal(true);
        }}
        onView={(t) => {
          setEditing(null);
          setViewing(t);
          setShowModal(true);
        }}
        addLabel="کارخانه جدید"
      />
      <FormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          setViewing(null);
        }}
        onSubmit={async (d: any) => {
          if (viewing) return;
          try {
            const payload = {
              code: d.code,
              name: d.name,
              owner_name: d.ownerName,
              industry: d.industry,
              owner_mobile: d.ownerMobile,
              owner_email: d.ownerEmail,
              address: d.address,
              city: d.city,
              plan: d.plan,
              status: d.status,
              expiration_date: convertDate(d.expiresAt),
              user_limit: Number(d.userLimit),
            };
            if (editing) {
              await factoryService.updateFactory(editing.id, payload);
            } else {
              await factoryService.createFactory(payload);
            }

            const data = await factoryService.getFactories();
            setLocalFactories(data ?? []);
            setShowModal(false);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log("STATUS:", error.response?.status);
              console.log("DATA:", error.response?.data);
            } else {
              console.log("Unexpected error:", error);
            }
          }
        }}
        title={
          viewing
            ? "مشاهده کارخانه"
            : editing
              ? "ویرایش کارخانه"
              : "کارخانه جدید"
        }
        fields={formFields.map((f) => ({
          ...f,
          disabled: !!viewing,
        }))}
        initialData={viewing || editing || {}}
        size="lg"
      />
      <div className="space-y-3">
        <h2 className="text-white font-bold text-lg">
          ماژول‌های فعال هر کارخانه
        </h2>
        {localFactories.map((f) => (
          <div
            key={f.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedFactory(expandedFactory === f.id ? null : f.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500 font-black">
                  {f.code.charAt(0)}
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{f.name}</p>
                  <p className="text-zinc-500 text-xs">
                    {(f.enabledModules ?? []).length} ماژول فعال
                  </p>
                </div>
              </div>
              <span className="text-zinc-600">
                {expandedFactory === f.id ? "▲" : "▼"}
              </span>
            </button>
            {expandedFactory === f.id && (
              <div className="px-4 pb-4 border-t border-zinc-800 pt-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {modules
                    .filter((m) => m.id !== "core" && m.id !== "superadmin")
                    .map((mod) => {
                      const enabled = f.enabledModules.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs ${enabled ? "bg-green-500/10 border border-green-600/20" : "bg-zinc-800/50 border border-zinc-800"}`}
                        >
                          <span
                            className={enabled ? "text-white" : "text-zinc-500"}
                          >
                            {mod.title}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enabled}
                              readOnly
                              className="sr-only peer"
                            />
                            <div
                              className={`w-8 h-4 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[1px] after:start-[1px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all ${enabled ? "bg-green-600" : "bg-zinc-600"}`}
                            />
                          </label>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8">
        <PageBuilderSection factoryId={expandedFactory || ""} />
      </div>
    </div>
  );
}

function PageBuilderSection({ factoryId }: { factoryId: string }) {
  const [localPages, setLocalPages] = useState(initialPages);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  const factoryPages = factoryId
    ? localPages.filter((p) => p.factoryId === factoryId)
    : localPages;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">
          📋 سازنده صفحات سفارشی (Page Builder)
        </h2>
        <button
          onClick={() => {
            setEditingPage(null);
            setShowBuilder(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus size={15} />
          صفحه جدید
        </button>
      </div>
      {!factoryId && (
        <p className="text-zinc-600 text-sm">
          یک کارخانه را از بالا انتخاب کنید تا صفحات آن را ببینید
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {factoryPages.map((p) => {
          const Icon = catIcons[p.category];
          const color = catColors[p.category];
          return (
            <div
              key={p.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  {/* <div>
                    <p className="text-white font-medium text-sm">{p.title}</p>
                    <p className="text-zinc-500 text-[10px]">
                      {catLabels[p.category]} •{" "}
                      {initialFactories.find((f) => f.id === p.factoryId)
                        ?.name || p.factoryId}
                    </p>
                  </div> */}
                </div>
              </div>
              <p className="text-zinc-500 text-xs mb-3">
                {p.schema.length} فیلد
              </p>
              <button
                onClick={() => {
                  setEditingPage(p);
                  setShowBuilder(true);
                }}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 rounded-lg text-xs transition-colors"
              >
                ویرایش
              </button>
            </div>
          );
        })}
        {factoryPages.length === 0 && factoryId && (
          <p className="text-zinc-600 text-sm col-span-3 text-center py-8">
            هیچ صفحه سفارشی برای این کارخانه ساخته نشده
          </p>
        )}
      </div>
      <PageBuilderModal
        isOpen={showBuilder}
        onClose={() => setShowBuilder(false)}
        page={editingPage}
        factoryId={factoryId}
      />
    </div>
  );
}

function PageBuilderModal({
  isOpen,
  onClose,
  page,
  factoryId,
}: {
  isOpen: boolean;
  onClose: () => void;
  page: CustomPage | null;
  factoryId: string;
}) {
  const [title, setTitle] = useState(page?.title || "");
  const [category, setCategory] = useState<CustomPageCategory>(
    page?.category || "form",
  );
  const [selectedFactory, setSelectedFactory] = useState(
    page?.factoryId || factoryId,
  );
  const [fields, setFields] = useState<CustomPageField[]>(page?.schema || []);
  const [newField, setNewField] = useState<CustomPageField>({
    name: "",
    label: "",
    type: "text",
    required: false,
  });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;
  const addField = () => {
    if (!newField.name || !newField.label) return;
    setFields((prev) => [
      ...prev,
      { ...newField, name: newField.name.replace(/\s+/g, "_") },
    ]);
    setNewField({ name: "", label: "", type: "text", required: false });
  };
  const removeField = (idx: number) =>
    setFields((prev) => prev.filter((_, i) => i !== idx));
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };
  const typeIcons: Record<string, string> = {
    text: "📝",
    number: "🔢",
    select: "📋",
    date: "📅",
    time: "⏰",
    textarea: "📄",
    checkbox: "✅",
    file: "📎",
    signature: "✍️",
    barcode: "📊",
    qr: "📱",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {page ? "ویرایش صفحه" : "صفحه سفارشی جدید"}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                عنوان صفحه
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50"
              />
            </div>
            {/* <div>
              <label className="block text-sm text-zinc-400 mb-1">
                کارخانه
              </label>
              <select
                value={selectedFactory}
                onChange={(e) => setSelectedFactory(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500/50"
              >
                {initialFactories.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div> */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">دسته</label>
              <div className="flex gap-2">
                {(
                  Object.entries(catLabels) as [CustomPageCategory, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === key ? "text-white" : "text-zinc-500 bg-zinc-800 hover:text-white"}`}
                    style={
                      category === key
                        ? {
                            backgroundColor: `${catColors[key]}25`,
                            color: catColors[key],
                          }
                        : {}
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">فیلدهای فرم</h3>
            <div className="space-y-2 mb-4">
              {fields.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-zinc-800/50 rounded-xl px-3 py-2"
                >
                  <span className="text-lg">{typeIcons[f.type] || "📄"}</span>
                  <span className="flex-1 text-white text-sm">{f.label}</span>
                  <span className="text-zinc-500 text-xs">
                    {f.type} {f.required ? "• الزامی" : ""}
                  </span>
                  <button
                    onClick={() => removeField(i)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {fields.length === 0 && (
                <p className="text-zinc-600 text-sm text-center py-4">
                  هنوز فیلدی اضافه نشده
                </p>
              )}
            </div>
            <div className="bg-zinc-800/30 rounded-xl p-3 space-y-2">
              <p className="text-zinc-400 text-xs font-medium">
                افزودن فیلد جدید
              </p>
              <div className="flex gap-2">
                <input
                  value={newField.label}
                  onChange={(e) =>
                    setNewField((prev) => ({
                      ...prev,
                      label: e.target.value,
                      name: e.target.value.replace(/\s+/g, "_"),
                    }))
                  }
                  placeholder="برچسب فیلد"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-purple-500/50"
                />
                <select
                  value={newField.type}
                  onChange={(e) =>
                    setNewField((prev) => ({
                      ...prev,
                      type: e.target.value as any,
                    }))
                  }
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-white text-sm outline-none"
                >
                  {Object.entries(typeIcons).map(([key, icon]) => (
                    <option key={key} value={key}>
                      {icon} {key}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1 text-xs text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField((prev) => ({
                        ...prev,
                        required: e.target.checked,
                      }))
                    }
                    className="accent-purple-500"
                  />
                  الزامی
                </label>
                <button
                  onClick={addField}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded-lg text-xs transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!title || fields.length === 0}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? "bg-green-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
          >
            {saved ? "✓ ذخیره شد" : "ذخیره صفحه"}
          </button>
        </div>
      </div>
    </div>
  );
}

// function ModulesPage() {
//   const [factories, setFactories] = useState(initialFactories);
//   const [activeFactoryId, setActiveFactoryId] = useState(
//     factories[0]?.id || "",
//   );
//   const factory = factories.find((f) => f.id === activeFactoryId);
//   const allModules = modules.filter(
//     (m) => m.id !== "core" && m.id !== "superadmin",
//   );

//   const toggleModule = (moduleId: string) => {
//     setFactories((prev) =>
//       prev.map((f) =>
//         f.id === activeFactoryId
//           ? {
//               ...f,
//               enabledModules: f.enabledModules.includes(moduleId)
//                 ? f.enabledModules.filter((m) => m !== moduleId)
//                 : [...f.enabledModules, moduleId],
//             }
//           : f,
//       ),
//     );
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-xl font-bold text-white">فعال‌سازی ماژول‌ها</h1>
//         <p className="text-zinc-500 text-sm">
//           انتخاب کنید هر کارخانه چه ماژول‌هایی فعال داشته باشد
//         </p>
//       </div>
//       <div className="flex gap-2 flex-wrap">
//         {factories.map((f) => (
//           <button
//             key={f.id}
//             onClick={() => setActiveFactoryId(f.id)}
//             className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeFactoryId === f.id ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}
//           >
//             {f.name}
//           </button>
//         ))}
//       </div>
//       {factory && (
//         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500 font-black">
//               {factory.code.charAt(0)}
//             </div>
//             <div>
//               <h3 className="text-white font-bold">{factory.name}</h3>
//               <p className="text-zinc-500 text-xs">
//                 {factory.enabledModules.length} از {allModules.length} ماژول
//                 فعال
//               </p>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//             {allModules.map((mod) => {
//               const isOn = factory.enabledModules.includes(mod.id);
//               return (
//                 <div
//                   key={mod.id}
//                   className={`bg-zinc-800/50 border rounded-xl p-3 flex items-center justify-between ${isOn ? "border-green-500/30" : "border-zinc-700"}`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <mod.icon
//                       size={16}
//                       style={{ color: isOn ? mod.color : "#52525b" }}
//                     />
//                     <span
//                       className={
//                         isOn ? "text-white text-sm" : "text-zinc-500 text-sm"
//                       }
//                     >
//                       {mod.title}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => toggleModule(mod.id)}
//                     className={`relative w-10 h-5 rounded-full transition-all ${isOn ? "bg-green-600" : "bg-zinc-600"}`}
//                   >
//                     <div
//                       className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isOn ? "left-[22px]" : "left-[2px]"}`}
//                     />
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//           <p className="text-zinc-600 text-xs mt-4">
//             تغییرات به‌صورت لحظه‌ای اعمال می‌شوند و کاربران آن کارخانه در لاگین
//             بعدی ماژول‌های جدید را می‌بینند.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

function HealthPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">مانیتورینگ سلامت سیستم</h1>
        <p className="text-zinc-500 text-sm">وضعیت سرورها و سرویس‌های ابری</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CPU", value: 34, icon: Cpu, color: "#10b981" },
          { label: "RAM", value: 52, icon: Cpu, color: "#f59e0b" },
          { label: "Disk", value: 68, icon: Cpu, color: "#f59e0b" },
          { label: "Database", value: 22, icon: Cpu, color: "#10b981" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <item.icon size={24} style={{ color: item.color }} />
              <span className="text-3xl font-black text-white">
                {item.value}%
              </span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{ width: `${item.value}%`, backgroundColor: item.color }}
              />
            </div>
            <p className="text-zinc-500 text-sm mt-2">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">سرویس‌های ابری</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {[
            { name: "API Gateway", status: "online", uptime: "۹۹.۹۹%" },
            { name: "Auth Service", status: "online", uptime: "۹۹.۹۷%" },
            { name: "Database Cluster", status: "online", uptime: "۹۹.۹۵%" },
            { name: "File Storage", status: "online", uptime: "۹۹.۹۹%" },
            { name: "Notification", status: "online", uptime: "۹۹.۸۸%" },
            { name: "AI Inference", status: "online", uptime: "۹۸.۵۰%" },
            { name: "PLC Bridge", status: "degraded", uptime: "۹۵.۲۰%" },
            { name: "Realtime Stream", status: "online", uptime: "۹۹.۹۰%" },
          ].map((s) => (
            <div key={s.name} className="bg-zinc-800/30 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${s.status === "online" ? "bg-green-500" : s.status === "degraded" ? "bg-amber-500" : "bg-red-500"}`}
                />
                <span className="text-white text-xs">{s.name}</span>
              </div>
              <p className="text-zinc-500 text-[10px] mt-1">
                Uptime: {s.uptime}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketplacePage() {
  const [items, setItems] = useState([
    { name: "تم صنعتی آبی", type: "Theme", price: "رایگان", installed: true },
    {
      name: "ویجت OEE پیشرفته",
      type: "Widget",
      price: "۵۰۰,۰۰۰ تومان",
      installed: false,
    },
    {
      name: "پک خودروسازی",
      type: "Industry Pack",
      price: "۲,۰۰۰,۰۰۰ تومان",
      installed: false,
    },
    {
      name: "عامل AI تولید",
      type: "AI Agent",
      price: "۱,۰۰۰,۰۰۰ تومان",
      installed: true,
    },
    {
      name: "گزارش‌ساز پیشرفته",
      type: "Plugin",
      price: "۸۰۰,۰۰۰ تومان",
      installed: false,
    },
    {
      name: "داشبورد مدیرعامل",
      type: "Dashboard",
      price: "رایگان",
      installed: true,
    },
  ]);

  const toggleInstall = (idx: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, installed: !item.installed } : item,
      ),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">مارکت‌پلیس</h1>
        <p className="text-zinc-500 text-sm">افزونه‌ها، تم‌ها و پک‌های صنعتی</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div
            key={item.name}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">
                {item.type}
              </span>
              {item.installed && (
                <CheckCircle2 size={16} className="text-green-500" />
              )}
            </div>
            <h3 className="text-white font-bold">{item.name}</h3>
            <p className="text-zinc-500 text-sm mt-1">{item.price}</p>
            <button
              onClick={() => toggleInstall(i)}
              className={`w-full mt-4 py-2 rounded-xl text-sm font-medium transition-all ${item.installed ? "bg-zinc-800 text-zinc-400" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {item.installed ? "نصب شده" : "نصب"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
