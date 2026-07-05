import { useState, useMemo, useEffect } from "react";
import {
  Users,
  Shield,
  Activity,
  Bell,
  FileText,
  Palette,
  Settings,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  XCircle,
  TriangleAlert,
  Info,
  Eye,
  Trash2,
  Filter,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import DataTable, { Column } from "@/components/ui/DataTable";
import FormModal, { FormField } from "@/components/ui/FormModal";
import StatCard, { StatGrid } from "@/components/ui/StatCard";
import {
  users,
  roles,
  auditLogs,
  notifications,
  files,
  coreStatistics,
} from "@/data/phase1Data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { User, AuditLog, Role, FileRecord } from "@/types";
import { uid } from "@/services/dataService";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { fieldsService } from "@/services/fieldsService";

export function CorePlatformModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  switch (currentPage) {
    case "users":
      return <UsersPage />;
    case "roles":
      return <RolesPage />;
    case "audit":
      return <AuditLogPage />;
    case "notifications":
      return <NotificationsPage />;
    case "files":
      return <FilesPage />;
    case "theme":
      return <ThemePage />;
    default:
      return <CoreDashboard />;
  }
}

function CoreDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">هسته پلتفرم</h1>
          <p className="text-zinc-500">
            مدیریت کاربران، نقش‌ها، دسترسی‌ها و تنظیمات سیستم
          </p>
        </div>
      </div>

      <StatGrid columns={4}>
        <StatCard
          title="کاربران فعال"
          value={coreStatistics.activeUsers}
          unit="نفر"
          change="+۱۲ این ماه"
          changeType="up"
          icon={<Users size={22} />}
          color="#3b82f6"
        />
        <StatCard
          title="آنلاین الان"
          value={coreStatistics.onlineUsers}
          unit="نفر"
          icon={<Activity size={22} />}
          color="#10b981"
        />
        <StatCard
          title="نقش‌های تعریف‌شده"
          value={roles.length}
          icon={<Shield size={22} />}
          color="#8b5cf6"
        />
        <StatCard
          title="فضای مصرفی"
          value={`${coreStatistics.storageUsage.used}`}
          unit={`از ${coreStatistics.storageUsage.total} GB`}
          icon={<FileText size={22} />}
          color="#f59e0b"
        />
      </StatGrid>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Login Trend */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" /> روند ورود به سیستم
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={coreStatistics.loginTrend}>
              <defs>
                <linearGradient id="gradLogins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="logins"
                stroke="#3b82f6"
                fill="url(#gradLogins)"
                name="ورود"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Storage Usage */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <FileText size={16} className="text-amber-500" /> مصرف فضای
            ذخیره‌سازی
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={coreStatistics.storageUsage.breakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={40}
                  dataKey="value"
                  stroke="none"
                >
                  {coreStatistics.storageUsage.breakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {coreStatistics.storageUsage.breakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-zinc-400">{item.name}</span>
                  </div>
                  <span className="text-zinc-300">{item.value} GB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* API Usage */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Globe size={16} className="text-green-500" /> مصرف API
          </h3>
          <span className="text-sm text-zinc-500">
            {coreStatistics.apiUsage.today.toLocaleString()} /{" "}
            {coreStatistics.apiUsage.limit.toLocaleString()} درخواست امروز
          </span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={coreStatistics.apiUsage.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="hour" tick={{ fill: "#71717a", fontSize: 11 }} />
            <YAxis tick={{ fill: "#71717a", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="calls"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="درخواست"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "کاربران",
            icon: Users,
            color: "#3b82f6",
            page: "users",
            count: users.length,
          },
          {
            title: "نقش‌ها",
            icon: Shield,
            color: "#8b5cf6",
            page: "roles",
            count: roles.length,
          },
          {
            title: "لاگ فعالیت",
            icon: Activity,
            color: "#10b981",
            page: "audit",
            count: auditLogs.length,
          },
          {
            title: "اعلان‌ها",
            icon: Bell,
            color: "#f59e0b",
            page: "notifications",
            count: notifications.length,
          },
          {
            title: "فایل‌ها",
            icon: FileText,
            color: "#06b6d4",
            page: "files",
            count: files.length,
          },
          { title: "ظاهر", icon: Palette, color: "#ec4899", page: "theme" },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => useAppStore.getState().setCurrentPage(item.page)}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 text-center transition-all group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <p className="text-white text-sm font-medium">{item.title}</p>
            {item.count !== undefined && (
              <p className="text-zinc-500 text-xs mt-0.5">{item.count}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserApi | null>(null);
  const [choices, setChoices] = useState<ChoicesResponse>({
    roles: [],
    shifts: [],
    employment_types: [],
    statuses: [],
    units: [],
  });
  const [localUsers, setLocalUsers] = useState<UserApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserApi | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const factory = useAuthStore.getState().user?.factory;

  type ChoiceItem = {
    id: number;
    code: string;
    label: string;
    factory: number;
    is_active: boolean;
    created_at: string;
  };

  type ChoicesResponse = {
    roles: ChoiceItem[];
    shifts: ChoiceItem[];
    employment_types: ChoiceItem[];
    statuses: ChoiceItem[];
    units: ChoiceItem[];
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const load = async () => {
      await fetchUsers();
      await fetchChoices();
    };

    load();
  }, []);
  useEffect(() => {
    fetchUsers({
      search: debouncedSearch,
    });
  }, [debouncedSearch]);

  const fetchChoices = async () => {
    try {
      const response = await fieldsService.getChoices();

      const getItems = (key: string): ChoiceItem[] =>
        (
          response.find((item) => item.key === key)?.items as
            | ChoiceItem[]
            | undefined
        )?.filter((i) => i.factory === factory) ?? [];

      setChoices({
        roles: getItems("roles"),
        shifts: getItems("shifts"),
        employment_types: getItems("employment_types"),
        statuses: getItems("statuses"),
        units: getItems("units"),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async (params?: { search?: string }) => {
    try {
      setLoading(true);

      const response = await userService.getUsers(params);

      setLocalUsers(response ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  type UserApi = {
    id: number;
    national_code: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    personal_code: string;
    role: string;
    factory: number;
    unit: number;
    shift: string;
    employment_type: string;
    status: string;
    is_active: boolean;
    created_at: string;
  };

  const columns: Column<UserApi>[] = [
    {
      key: "personal_code",
      title: "کد پرسنلی",
      render: (v) => <span className="font-mono text-blue-400">{v}</span>,
    },
    {
      key: "full_name",
      title: "نام",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500 text-xs font-bold">
            {row.full_name.charAt(0)}
          </div>
          <div>
            <p className="text-white text-sm">
              {row.first_name} {row.last_name}
            </p>
            <p className="text-zinc-500 text-xs" dir="ltr">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phone_number",
      title: "موبایل",
      render: (v) => <span dir="ltr">{v}</span>,
    },
    {
      key: "unit",
      title: "واحد",
      render: (v) => {
        const unit = choices.units.find((u) => u.id === Number(v));
        return unit?.label || "-";
      },
    },
    {
      key: "role",
      title: "نقش",
      render: (v) => {
        const role = choices.roles.find((r) => r.code === v);
        return (
          <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">
            {role?.label || v}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "وضعیت",
      render: (v) => {
        const status = choices.statuses.find((s) => s.code === v);

        return (
          <span
            className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
              status?.code === "active"
                ? "bg-green-500/10 text-green-500"
                : status?.code === "inactive"
                  ? "bg-zinc-500/10 text-zinc-500"
                  : "bg-red-500/10 text-red-500"
            }`}
          >
            {status?.label ?? v}
          </span>
        );
      },
    },
  ];

  const formFields: FormField[] = [
    {
      name: "first_name",
      label: "نام",
      type: "text",
      required: true,
      placeholder: "نام",
    },
    {
      name: "last_name",
      label: "نام خانوادگی",
      type: "text",
      required: true,
      placeholder: "نام خانوادگی",
    },
    {
      name: "national_code",
      label: "کد ملی",
      type: "text",
      required: true,
      placeholder: "۰۰۱۲۳۴۵۶۷۸",
      minLength: 10,
      maxLength: 10,
    },
    {
      name: "personal_code",
      label: "کد پرسنلی",
      type: "text",
      required: true,
    },
    {
      name: "phone_number",
      label: "موبایل",
      type: "tel",
      required: true,
      placeholder: "۰۹۱۲۱۲۳۴۵۶۷",
      minLength: 11,
      maxLength: 11,
    },
    {
      name: "email",
      label: "ایمیل",
      type: "email",
      required: true,
      placeholder: "email@company.ir",
    },
    {
      name: "unit",
      label: "واحد",
      type: "select",
      required: true,
      options: choices.units.map((u) => ({
        value: String(u.id),
        label: u.label,
      })),
    },
    {
      name: "role",
      label: "نقش",
      type: "select",
      required: true,
      options: choices.roles.map((r) => ({
        value: r.code,
        label: r.label,
      })),
    },
    {
      name: "shift",
      label: "شیفت",
      type: "select",
      required: true,
      options: choices.shifts.map((s) => ({
        value: s.code,
        label: s.label,
      })),
    },
    {
      name: "employment_type",
      label: "نوع استخدام",
      type: "select",
      required: true,
      options: choices.employment_types.map((e) => ({
        value: e.code,
        label: e.label,
      })),
    },
    {
      name: "status",
      label: "وضعیت",
      type: "select",
      required: true,
      options: choices.statuses.map((s) => ({
        value: s.code,
        label: s.label,
      })),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">مدیریت کاربران</h1>
        <p className="text-zinc-500 text-sm">
          ایجاد، ویرایش و مدیریت کاربران سیستم
        </p>
      </div>

      <DataTable<UserApi>
        data={localUsers}
        searchValue={search}
        onSearchChange={setSearch}
        columns={columns}
        title="لیست کاربران"
        icon={<Users size={18} className="text-blue-500" />}
        onAdd={() => {
          setEditingUser(null);
          setShowModal(true);
        }}
        onEdit={(user) => {
          setViewingUser(null);
          setEditingUser(user);
          setShowModal(true);
        }}
        onView={(user) => {
          setEditingUser(null);
          setViewingUser(user);
          setShowModal(true);
        }}
        addLabel="کاربر جدید"
      />

      <FormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
          setViewingUser(null);
        }}
        onSubmit={async (data) => {
          const payload = {
            ...data,
            factory,
          };
          try {
            if (editingUser) {
              await userService.updateUser(editingUser.id, payload);
            } else {
              await userService.createUser(payload);
            }
            await fetchUsers();
            setShowModal(false);
          } catch (error: any) {
            console.error("Full Error:", error);

            if (error.response) {
              console.log("Status:", error.response.status);
              console.log("Response Data:", error.response.data);
            }
          }
        }}
        title={
          viewingUser
            ? "مشاهده کاربر"
            : editingUser
              ? "ویرایش کاربر"
              : "کاربر جدید"
        }
        fields={formFields.map((field) => ({
          ...field,
          disabled: !!viewingUser,
        }))}
        initialData={viewingUser || editingUser || {}}
        size="lg"
      />
    </div>
  );
}

function RolesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [localRoles, setLocalRoles] = useState(roles);
  const [removingRole, setRemovingRole] = useState<string | null>(null);

  const roleFormFields: FormField[] = [
    {
      name: "name",
      label: "نام نقش",
      type: "text",
      required: true,
      placeholder: "مدیر تولید",
    },
    {
      name: "nameEn",
      label: "نام انگلیسی",
      type: "text",
      required: true,
      placeholder: "Production Manager",
    },
    {
      name: "description",
      label: "توضیحات",
      type: "text",
      required: true,
      placeholder: "توضیحات نقش",
    },
    {
      name: "level",
      label: "سطح",
      type: "number",
      required: true,
      placeholder: "۱",
    },
    {
      name: "permissions",
      label: "دسترسی‌ها",
      type: "select",
      required: false,
      multi: true,
      options: [
        { value: "mes_create", label: "MES - ایجاد" },
        { value: "mes_read", label: "MES - مشاهده" },
        { value: "mes_update", label: "MES - ویرایش" },
        { value: "mes_delete", label: "MES - حذف" },
        { value: "cmms_create", label: "CMMS - ایجاد" },
        { value: "cmms_read", label: "CMMS - مشاهده" },
        { value: "wms_create", label: "WMS - ایجاد" },
        { value: "wms_read", label: "WMS - مشاهده" },
      ],
    },
  ];

  const permissionActions = [
    { key: "create", label: "ایجاد" },
    { key: "read", label: "مشاهده" },
    { key: "update", label: "ویرایش" },
    { key: "delete", label: "حذف" },
    { key: "approve", label: "تأیید" },
    { key: "export", label: "خروجی" },
    { key: "import", label: "ورود داده" },
    { key: "view_cost", label: "مشاهده هزینه" },
    { key: "view_salary", label: "مشاهده حقوق" },
  ];

  const modules = [
    "MES",
    "CMMS",
    "WMS",
    "QMS",
    "HRM",
    "HSE",
    "Finance",
    "Settings",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            مدیریت نقش‌ها و دسترسی‌ها
          </h1>
          <p className="text-zinc-500 text-sm">
            تعریف نقش‌ها و ماتریس دسترسی (RBAC)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
        >
          <Shield size={16} /> نقش جدید
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {localRoles.map((role) => (
          <div
            key={role.id}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-blue-500" />
                <h3 className="text-white font-bold">{role.name}</h3>
              </div>
              {role.isSystem && (
                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
                  سیستمی
                </span>
              )}
            </div>
            <p className="text-zinc-500 text-sm mb-3">{role.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600">سطح: {role.level}</span>
              <span className="text-zinc-600">{role.nameEn}</span>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-800">
              <button className="text-xs text-blue-500 hover:text-blue-400">
                دسترسی‌ها
              </button>
              {!role.isSystem && (
                <>
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setShowModal(true);
                    }}
                    className="text-xs text-amber-500 hover:text-amber-400"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => setRemovingRole(role.id)}
                    className="text-xs text-red-500 hover:text-red-400"
                  >
                    حذف
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix Preview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">ماتریس دسترسی</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-right text-zinc-500 px-2 py-2">ماژول</th>
                {permissionActions.map((action) => (
                  <th
                    key={action.key}
                    className="text-center text-zinc-500 px-2 py-2"
                  >
                    {action.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr key={mod} className="border-b border-zinc-800/50">
                  <td className="text-white px-2 py-2">{mod}</td>
                  {permissionActions.map((action) => (
                    <td key={action.key} className="text-center px-2 py-2">
                      <input
                        type="checkbox"
                        defaultChecked={Math.random() > 0.3}
                        className="w-3.5 h-3.5 rounded bg-zinc-700 border-zinc-600 text-blue-600"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          if (editingRole) {
            setLocalRoles((prev) =>
              prev.map((r) =>
                r.id === editingRole.id ? { ...r, ...(data as Role) } : r,
              ),
            );
          } else {
            setLocalRoles((prev) => [
              ...prev,
              { id: uid(), isSystem: false, ...(data as Role) },
            ]);
          }
          setShowModal(false);
        }}
        title={editingRole ? "ویرایش نقش" : "نقش جدید"}
        fields={roleFormFields}
        initialData={editingRole || {}}
      />

      {removingRole && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={() => setRemovingRole(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold mb-2">حذف نقش</h3>
            <p className="text-zinc-400 text-sm mb-4">
              آیا از حذف این نقش اطمینان دارید؟ این عملیات برگشت‌پذیر نیست.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRemovingRole(null)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-xl text-sm"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  setLocalRoles((prev) =>
                    prev.filter((r) => r.id !== removingRole),
                  );
                  setRemovingRole(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditLogPage() {
  const [filterModule, setFilterModule] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const modules = [...new Set(auditLogs.map((l) => l.module))].sort();
  const actionTypes = [...new Set(auditLogs.map((l) => l.action))].sort();
  const statuses = [...new Set(auditLogs.map((l) => l.status))].sort();

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((l) => {
      if (filterModule && l.module !== filterModule) return false;
      if (filterAction && l.action !== filterAction) return false;
      if (filterStatus && l.status !== filterStatus) return false;
      return true;
    });
  }, [filterModule, filterAction, filterStatus]);

  const columns: Column<AuditLog>[] = [
    {
      key: "timestamp",
      title: "زمان",
      render: (v) => (
        <span className="font-mono text-xs text-zinc-400">{v}</span>
      ),
    },
    {
      key: "userName",
      title: "کاربر",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600/20 rounded flex items-center justify-center text-blue-500 text-[10px] font-bold">
            {row.userName.charAt(0)}
          </div>
          <div>
            <p className="text-white text-sm">{row.userName}</p>
            <p className="text-zinc-600 text-[10px]">{row.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: "module",
      title: "ماژول",
      render: (v) => {
        const colors: Record<string, string> = {
          MES: "#10b981",
          CMMS: "#dc2626",
          WMS: "#f59e0b",
          QMS: "#22c55e",
          HRM: "#ec4899",
          HSE: "#eab308",
          Auth: "#8b5cf6",
          Settings: "#64748b",
          Core: "#3b82f6",
          Incidents: "#f97316",
          Alerts: "#ef4444",
          Dashboard: "#06b6d4",
        };
        return (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: (colors[v] || "#64748b") + "20",
              color: colors[v] || "#64748b",
            }}
          >
            {v}
          </span>
        );
      },
    },
    {
      key: "action",
      title: "عملیات",
      render: (v) => {
        const labels: Record<string, string> = {
          login: "ورود",
          logout: "خروج",
          create: "ایجاد",
          update: "ویرایش",
          delete: "حذف",
          approve: "تأیید",
          reject: "رد",
          start: "شروع",
          complete: "تکمیل",
          issue: "صدور",
        };
        const colors: Record<string, string> = {
          login: "#3b82f6",
          logout: "#64748b",
          create: "#10b981",
          update: "#f59e0b",
          delete: "#ef4444",
          approve: "#22c55e",
          reject: "#ef4444",
          start: "#8b5cf6",
          complete: "#10b981",
          issue: "#f59e0b",
        };
        return (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: (colors[v] || "#64748b") + "20",
              color: colors[v] || "#64748b",
            }}
          >
            {labels[v] || v}
          </span>
        );
      },
    },
    {
      key: "entityType",
      title: "موجودیت",
      render: (v) => {
        const labels: Record<string, string> = {
          production_order: "سفارش تولید",
          work_order: "دستور کار",
          incident: "حادثه",
          receiving: "ورود کالا",
          settings: "تنظیمات",
          inspection: "بازرسی",
          employee: "کارمند",
          session: "نشست",
          user: "کاربر",
          dashboard: "داشبورد",
          permit: "مجوز",
          scrap: "ضایعات",
          material: "مواد",
          leave_request: "مرخصی",
          production_entry: "ثبت تولید",
          downtime: "توقف",
          alert_rule: "قانون هشدار",
          shift_schedule: "برنامه شیفت",
          inventory: "موجودی",
          notification: "اعلان",
          role: "نقش",
          production_plan: "برنامه تولید",
          incident_report: "گزارش حادثه",
        };
        return <span className="text-zinc-400 text-xs">{labels[v] || v}</span>;
      },
    },
    {
      key: "entityId",
      title: "کد",
      render: (v) => (
        <span className="font-mono text-[11px] text-zinc-500" dir="ltr">
          {v}
        </span>
      ),
    },
    {
      key: "ip",
      title: "IP",
      render: (v) => (
        <span className="font-mono text-[10px] text-zinc-600" dir="ltr">
          {v}
        </span>
      ),
    },
    {
      key: "status",
      title: "وضعیت",
      render: (v) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${v === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
        >
          {v === "success" ? "موفق" : "ناموفق"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">
          لاگ فعالیت‌ها (Audit Trail)
        </h1>
        <p className="text-zinc-500 text-sm">
          ثبت کامل تمام فعالیت‌های کاربران در سیستم — برای مشاهده جزئیات روی هر
          ردیف کلیک کنید
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-zinc-500" />
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="bg-transparent text-white text-sm border-none outline-none"
          >
            <option value="">همه ماژول‌ها</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {filterModule && (
            <button
              onClick={() => setFilterModule("")}
              className="text-zinc-500 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-zinc-500" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-transparent text-white text-sm border-none outline-none"
          >
            <option value="">همه عملیات‌ها</option>
            {actionTypes.map((a) => {
              const labels: Record<string, string> = {
                login: "ورود",
                logout: "خروج",
                create: "ایجاد",
                update: "ویرایش",
                delete: "حذف",
                approve: "تأیید",
                reject: "رد",
                start: "شروع",
                complete: "تکمیل",
                issue: "صدور",
              };
              return (
                <option key={a} value={a}>
                  {labels[a] || a}
                </option>
              );
            })}
          </select>
          {filterAction && (
            <button
              onClick={() => setFilterAction("")}
              className="text-zinc-500 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-zinc-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-white text-sm border-none outline-none"
          >
            <option value="">همه وضعیت‌ها</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "success" ? "موفق" : "ناموفق"}
              </option>
            ))}
          </select>
          {filterStatus && (
            <button
              onClick={() => setFilterStatus("")}
              className="text-zinc-500 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div className="text-sm text-zinc-500 self-center">
          {filteredLogs.length} رکورد
        </div>
      </div>

      <DataTable
        data={filteredLogs}
        columns={columns}
        title="تاریخچه فعالیت"
        icon={<Activity size={18} className="text-green-500" />}
        pageSize={15}
        actions={true}
        onView={(log) => setSelectedLog(log)}
      />

      {selectedLog && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full m-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">جزئیات فعالیت</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">کاربر</p>
                  <p className="text-white font-medium">
                    {selectedLog.userName}
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">زمان</p>
                  <p className="text-white font-mono text-xs">
                    {selectedLog.timestamp}
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">ماژول</p>
                  <p className="text-white">{selectedLog.module}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">عملیات</p>
                  <p className="text-white capitalize">{selectedLog.action}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">موجودیت</p>
                  <p className="text-white">
                    {selectedLog.entityType} — {selectedLog.entityId}
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">وضعیت</p>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${selectedLog.status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    {selectedLog.status === "success" ? "موفق" : "ناموفق"}
                  </span>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">IP</p>
                  <p className="text-white font-mono text-xs" dir="ltr">
                    {selectedLog.ip}
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">موقعیت</p>
                  <p className="text-white">{selectedLog.location || "-"}</p>
                </div>
              </div>
              {selectedLog.userAgent && (
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">مرورگر / دستگاه</p>
                  <p className="text-white text-xs">{selectedLog.userAgent}</p>
                </div>
              )}
              {selectedLog.oldValue &&
                Object.keys(selectedLog.oldValue).length > 0 && (
                  <div className="bg-zinc-800/50 rounded-xl p-3">
                    <p className="text-zinc-500 text-xs mb-1">مقادیر قبلی</p>
                    <pre className="text-amber-400 text-xs font-mono whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.oldValue, null, 2)}
                    </pre>
                  </div>
                )}
              {selectedLog.newValue &&
                Object.keys(selectedLog.newValue).length > 0 && (
                  <div className="bg-zinc-800/50 rounded-xl p-3">
                    <p className="text-zinc-500 text-xs mb-1">مقادیر جدید</p>
                    <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.newValue, null, 2)}
                    </pre>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationsPage() {
  const notifIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <TriangleAlert size={16} className="text-amber-500" />;
      case "error":
        return <XCircle size={16} className="text-red-500" />;
      case "success":
        return <CheckCircle2 size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">مرکز اعلان‌ها</h1>
        <p className="text-zinc-500 text-sm">
          مدیریت کانال‌ها و تنظیمات اعلان‌رسانی
        </p>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { name: "درون‌برنامه‌ای", icon: Bell, active: true },
          { name: "پیامک", icon: Phone, active: true },
          { name: "ایمیل", icon: Mail, active: true },
          { name: "تلگرام", icon: Globe, active: false },
          { name: "واتساپ", icon: Globe, active: false },
          { name: "تماس صوتی", icon: Phone, active: false },
        ].map((ch) => (
          <div
            key={ch.name}
            className={`bg-zinc-900 border rounded-xl p-4 text-center ${ch.active ? "border-green-500/30" : "border-zinc-800"}`}
          >
            <ch.icon
              size={24}
              className={`mx-auto mb-2 ${ch.active ? "text-green-500" : "text-zinc-600"}`}
            />
            <p className="text-white text-sm">{ch.name}</p>
            <span
              className={`text-xs ${ch.active ? "text-green-500" : "text-zinc-600"}`}
            >
              {ch.active ? "فعال" : "غیرفعال"}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Notifications */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">اعلان‌های اخیر</h3>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-3 rounded-xl ${n.read ? "bg-zinc-800/30" : "bg-zinc-800/60 border border-zinc-700"}`}
            >
              {notifIcon(n.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{n.title}</p>
                  {!n.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <p className="text-zinc-500 text-xs mt-0.5">{n.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-zinc-600">{n.sentAt}</span>
                  {n.module && (
                    <span className="text-[10px] bg-zinc-700 px-1.5 py-0.5 rounded">
                      {n.module}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilesPage() {
  const [showModal, setShowModal] = useState(false);
  const [localFiles, setLocalFiles] = useState(files);
  const [removingFile, setRemovingFile] = useState<string | null>(null);

  const getFileIcon = (ext: string) => {
    const icons: Record<string, string> = {
      pdf: "📄",
      xlsx: "📊",
      docx: "📝",
      jpg: "🖼️",
      png: "🖼️",
      zip: "📦",
    };
    return icons[ext] || "📁";
  };

  const formatSize = (bytes: number) => {
    if (bytes > 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${(bytes / 1000).toFixed(0)} KB`;
  };

  const fileFormFields: FormField[] = [
    {
      name: "originalName",
      label: "نام فایل",
      type: "text",
      required: true,
      placeholder: "report.pdf",
    },
    {
      name: "extension",
      label: "نوع فایل",
      type: "select",
      required: true,
      options: [
        { value: "pdf", label: "PDF" },
        { value: "xlsx", label: "Excel" },
        { value: "docx", label: "Word" },
        { value: "jpg", label: "JPEG Image" },
        { value: "png", label: "PNG Image" },
        { value: "zip", label: "ZIP Archive" },
      ],
    },
    {
      name: "module",
      label: "ماژول",
      type: "text",
      required: true,
      placeholder: "MES",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">مدیریت فایل‌ها</h1>
        <p className="text-zinc-500 text-sm">
          آپلود، دانلود و مدیریت فایل‌های سیستم
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-white font-bold">فایل‌های اخیر</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
          >
            <FileText size={16} /> آپلود فایل
          </button>
        </div>
        <div className="p-4 space-y-3">
          {localFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 bg-zinc-800/50 rounded-xl p-4"
            >
              <span className="text-3xl">{getFileIcon(file.extension)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {file.originalName}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                  <span>{formatSize(file.size)}</span>
                  <span>{file.createdAt}</span>
                  <span className="bg-zinc-700 px-1.5 py-0.5 rounded">
                    {file.module}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg">
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => setRemovingFile(file.id)}
                  className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          setLocalFiles((prev) => [
            ...prev,
            { id: uid(), ...(data as FileRecord) },
          ]);
          setShowModal(false);
        }}
        title="آپلود فایل جدید"
        fields={fileFormFields}
        initialData={{}}
      />

      {removingFile && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={() => setRemovingFile(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold mb-2">حذف فایل</h3>
            <p className="text-zinc-400 text-sm mb-4">
              آیا از حذف این فایل اطمینان دارید؟ این عملیات برگشت‌پذیر نیست.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRemovingFile(null)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-xl text-sm"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  setLocalFiles((prev) =>
                    prev.filter((f) => f.id !== removingFile),
                  );
                  setRemovingFile(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ThemePage() {
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const themeFormFields: FormField[] = [
    {
      name: "primaryColor",
      label: "رنگ اصلی",
      type: "text",
      required: true,
      placeholder: "#3b82f6",
    },
    {
      name: "secondaryColor",
      label: "رنگ ثانویه",
      type: "text",
      required: true,
      placeholder: "#10b981",
    },
    {
      name: "accentColor",
      label: "رنگ تاکید",
      type: "text",
      required: true,
      placeholder: "#f59e0b",
    },
    {
      name: "fontFamily",
      label: "فونت",
      type: "text",
      required: false,
      placeholder: "IRANSans",
    },
    {
      name: "mode",
      label: "حالت نمایش",
      type: "select",
      required: true,
      options: [
        { value: "dark", label: "تاریک" },
        { value: "light", label: "روشن" },
        { value: "system", label: "خودکار" },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">تنظیمات ظاهری</h1>
          <p className="text-zinc-500 text-sm">
            سفارشی‌سازی رنگ‌ها، لوگو و تم سیستم
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
        >
          <Palette size={16} /> تنظیمات جدید
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رنگ اصلی</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue="#3b82f6"
                className="w-10 h-10 rounded-lg border-none cursor-pointer"
              />
              <input
                defaultValue="#3b82f6"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                dir="ltr"
              />
            </div>
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">
              رنگ ثانویه
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue="#10b981"
                className="w-10 h-10 rounded-lg border-none cursor-pointer"
              />
              <input
                defaultValue="#10b981"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-2">حالت نمایش</label>
          <div className="flex gap-3">
            {["تاریک", "روشن", "خودکار"].map((mode) => (
              <button
                key={mode}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  mode === "تاریک"
                    ? "bg-blue-600/10 border-blue-500 text-blue-500"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-2">لوگو</label>
          <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-700">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Settings size={28} className="text-white" />
            </div>
            <div>
              <button className="text-blue-500 text-sm hover:text-blue-400">
                آپلود لوگو جدید
              </button>
              <p className="text-zinc-500 text-xs mt-1">
                PNG یا SVG، حداکثر ۵۰۰ کیلوبایت
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
        >
          <Palette size={18} /> {saved ? "تنظیمات ذخیره شد ✓" : "ذخیره تنظیمات"}
        </button>
      </div>

      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          console.log("Theme settings saved", data);
          setShowModal(false);
        }}
        title="تنظیمات ظاهری"
        fields={themeFormFields}
        initialData={{}}
      />
    </div>
  );
}
