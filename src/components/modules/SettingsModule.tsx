import { useState, useEffect, type ChangeEvent } from "react";
import {
  Shield,
  GitBranch,
  Activity,
  Save,
  Bell,
  Palette,
  Building2,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { modules } from "@/data/modules";
import { fieldsService, ParentField } from "@/services/fieldsService";
import FormModal, { FormField } from "../ui/FormModal";

export function SettingsModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  switch (currentPage) {
    case "users":
      return <UsersPage />;
    case "field-options":
      return <FieldOptionsPage />;
    case "roles":
      return <RolesPage />;
    case "audit":
      return <AuditPage />;
    case "licenses":
      return <LicensesPage />;
    case "integrations":
      return <IntegrationsPage />;
    default:
      return <GeneralSettings />;
  }
}

function GeneralSettings() {
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <h2 className="text-xl font-bold text-white">تنظیمات عمومی</h2>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Building2 size={16} className="text-blue-500" /> اطلاعات کارخانه
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">
              نام کارخانه
            </label>
            <input
              defaultValue="کارخانه مرکزی فولاد پارس"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">
              کد کارخانه
            </label>
            <input
              defaultValue="FAC-001"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none font-mono"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">صنعت</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none">
              <option>فولاد و فلزات</option>
              <option>خودروسازی</option>
              <option>پتروشیمی</option>
              <option>غذایی</option>
              <option>دارویی</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">
              منطقه زمانی
            </label>
            <select
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
              dir="ltr"
            >
              <option>Asia/Tehran (UTC+3:30)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Palette size={16} className="text-purple-500" /> ظاهر و زبان
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">زبان</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none">
              <option>فارسی</option>
              <option>English</option>
              <option>العربية</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">تم</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none">
              <option>تیره (Dark)</option>
              <option>روشن (Light)</option>
              <option>خودکار (System)</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">تقویم</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none">
              <option>شمسی</option>
              <option>میلادی</option>
              <option>قمری</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رنگ برند</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue="#3b82f6"
                className="w-10 h-10 rounded-lg border-none cursor-pointer"
              />
              <input
                defaultValue="#3b82f6"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none font-mono text-sm"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Bell size={16} className="text-amber-500" /> اعلان‌ها
        </h3>
        <div className="space-y-3">
          {[
            "اعلان‌های ایمیلی",
            "اعلان‌های پوش",
            "اعلان SMS",
            "هشدارهای بحرانی",
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-zinc-300">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={i < 3}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          <Shield size={16} className="text-green-500" /> فعال/غیرفعال‌سازی
          ماژول‌ها
        </h3>
        <p className="text-zinc-500 text-xs mb-4">
          ماژول‌های غیرفعال در سایدبار نمایش داده نمی‌شوند و قابل دسترسی نیستند
        </p>
        <ModuleToggles />
      </div>

      <button
        onClick={save}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
      >
        {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
        {saved ? "ذخیره شد!" : "ذخیره تنظیمات"}
      </button>
    </div>
  );
}

function FieldOptionsPage() {
  const [parentFields, setParentFields] = useState<ParentField[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openParents, setOpenParents] = useState<Record<number, boolean>>({});
  const [removing, setRemoving] = useState<{
    id: number;
    type: string;
    name: string;
  } | null>(null);
  const user = useAuthStore((s) => s.user);
  const factory = useAuthStore.getState().user?.factory;
  const loadData = async () => {
    try {
      setLoading(true);

      const response = await fieldsService.getChoices();

      setParentFields(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const parentFieldOptions = parentFields.map((field) => ({
    label: field.label,
    value: field.key,
  }));
  const fields: FormField[] = [
    {
      name: "parentField",
      label: "فیلد مادر",
      type: "select",
      required: true,
      options: parentFieldOptions,
    },
    {
      name: "code",
      label: "کد",
      type: "text",
      required: true,
    },
    {
      name: "label",
      label: "عنوان",
      type: "text",
      required: true,
    },
  ];

  const toggleParent = (id: number) => {
    setOpenParents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id: number, type: string) => {
    try {
      await fieldsService.deleteChoice(id, type);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateChoice = async (data: Record<string, any>) => {
    console.log(data.parentField);
    try {
      await fieldsService.createChoice(data.parentField, {
        code: data.code,
        label: data.label,
        factory,
        is_active: true,
      });

      setIsModalOpen(false);
      await loadData();
    } catch (error: any) {
      console.log(error.response?.data);
      console.error(error);
    }
  };

  const allowedRoles = ["super_admin", "factory_admin"];

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <p className="text-red-400">شما دسترسی به این بخش را ندارید</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">گزینه های فیلد</h2>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-white"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            افزودن گزینه
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          {parentFields.map((parent) => (
            <div
              key={parent.id}
              className="border border-zinc-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleParent(parent.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800 transition"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{parent.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full">
                    {parent.items.length}
                  </span>
                  {openParents[parent.id] ? (
                    <ChevronDown className="text-zinc-400" />
                  ) : (
                    <ChevronLeft className="text-zinc-400" />
                  )}
                </div>
              </button>

              {openParents[parent.id] && (
                <div className="px-5 pt-5 pb-5 flex flex-wrap gap-3 items-center content-start">
                  {parent.items.length === 0 ? (
                    <p className="text-zinc-500 text-sm">
                      گزینه‌ای وجود ندارد.
                    </p>
                  ) : (
                    parent.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2"
                      >
                        <span className="text-white">{item.label}</span>

                        <button
                          onClick={() =>
                            setRemoving({
                              id: item.id,
                              type: parent.key,
                              name: item.label,
                            })
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                  {removing && (
                    <div
                      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
                      onClick={() => setRemoving(null)}
                    >
                      <div
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-white font-bold mb-2">حذف گزینه</h3>

                        <p className="text-zinc-400 text-sm mb-5">
                          آیا از حذف گزینه{" "}
                          <span className="text-white font-medium">
                            {removing.name}
                          </span>{" "}
                          اطمینان دارید؟
                        </p>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setRemoving(null)}
                            className="px-4 py-2 bg-zinc-700 text-white rounded-xl"
                          >
                            انصراف
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                await handleDelete(removing.id, removing.type);
                              } finally {
                                setRemoving(null);
                              }
                            }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateChoice}
        title="افزودن گزینه جدید"
        fields={fields}
        submitLabel="ثبت"
      />
    </>
  );
}

function ModuleToggles() {
  const disabledModules = useAppStore((s) => s.disabledModules);
  const toggleModule = useAppStore((s) => s.toggleModule);
  const canViewModule = useAuthStore((s) => s.canViewModule);
  const visibleModules = modules.filter((m) => canViewModule(m.id));
  const catOrder = [
    "phase1",
    "operations",
    "supply",
    "support",
    "intelligence",
  ];
  const catNames: Record<string, string> = {
    phase1: "🏗️ فاز ۱ - هسته",
    operations: "⚙️ عملیات",
    supply: "📦 زنجیره تأمین",
    support: "👥 پشتیبانی",
    intelligence: "🧠 هوشمندسازی",
  };

  return (
    <div className="space-y-4">
      {catOrder.map((catId) => {
        const catMods = visibleModules.filter((m) => m.category === catId);
        if (catMods.length === 0) return null;
        return (
          <div key={catId}>
            <p className="text-zinc-500 text-xs mb-2">{catNames[catId]}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {catMods.map((mod) => {
                const isOff = disabledModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <mod.icon size={14} style={{ color: mod.color }} />
                      <span
                        className={`text-sm ${isOff ? "text-zinc-600" : "text-zinc-300"}`}
                      >
                        {mod.title}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className={`w-9 h-5 rounded-full transition-all relative ${isOff ? "bg-zinc-700" : "bg-green-600"}`}
                    >
                      <div
                        className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${isOff ? "right-0.5" : "right-[18px]"}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UsersPage() {
  const users = [
    {
      id: 1,
      name: "مدیر سیستم",
      email: "admin@factoryos.ir",
      role: "مدیر سیستم",
      status: "فعال",
      lastLogin: "۱۴۰۳/۱۰/۰۲ - ۰۸:۳۰",
    },
    {
      id: 2,
      name: "علی احمدی",
      email: "manager@factoryos.ir",
      role: "مدیر تولید",
      status: "فعال",
      lastLogin: "۱۴۰۳/۱۰/۰۲ - ۰۷:۴۵",
    },
    {
      id: 3,
      name: "رضا موسوی",
      email: "operator@factoryos.ir",
      role: "اپراتور",
      status: "فعال",
      lastLogin: "۱۴۰۳/۱۰/۰۱ - ۲۲:۰۰",
    },
    {
      id: 4,
      name: "حسن کریمی",
      email: "hasan@factoryos.ir",
      role: "تکنسین",
      status: "فعال",
      lastLogin: "۱۴۰۳/۱۰/۰۲ - ۰۸:۰۰",
    },
    {
      id: 5,
      name: "فاطمه رضایی",
      email: "fatemeh@factoryos.ir",
      role: "تحلیلگر",
      status: "غیرفعال",
      lastLogin: "۱۴۰۳/۰۹/۲۸ - ۱۶:۰۰",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">مدیریت کاربران</h2>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all">
          <Plus size={16} /> کاربر جدید
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                نام
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                ایمیل
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                نقش
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                وضعیت
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                آخرین ورود
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500 text-xs font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <span className="text-sm text-white">{u.name}</span>
                  </div>
                </td>
                <td
                  className="px-4 py-3 text-sm text-zinc-400 font-mono"
                  dir="ltr"
                >
                  {u.email}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-300">{u.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-medium ${u.status === "فعال" ? "bg-green-500/10 text-green-500" : "bg-zinc-500/10 text-zinc-500"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500">
                  {u.lastLogin}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg">
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RolesPage() {
  const roles = [
    {
      name: "مدیر سیستم",
      count: 1,
      permissions: ["همه ماژول‌ها", "مدیریت کاربران", "تنظیمات", "لایسنس"],
    },
    {
      name: "مدیر تولید",
      count: 3,
      permissions: ["MES", "Command Center", "WMS", "QMS"],
    },
    { name: "اپراتور", count: 12, permissions: ["MES", "WMS"] },
    { name: "تکنسین نت", count: 5, permissions: ["CMMS", "WMS"] },
    { name: "بازرس کیفیت", count: 4, permissions: ["QMS", "LIMS"] },
    { name: "انباردار", count: 3, permissions: ["WMS"] },
    { name: "مدیر مالی", count: 2, permissions: ["Finance", "SRM", "Reports"] },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield size={20} className="text-blue-500" /> نقش‌ها و دسترسی‌ها
          (RBAC)
        </h2>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all">
          <Plus size={16} /> نقش جدید
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.name}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">{role.name}</h3>
              <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">
                {role.count} کاربر
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.map((p) => (
                <span
                  key={p}
                  className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800">
              <button className="text-xs text-blue-500 hover:text-blue-400">
                ویرایش
              </button>
              <button className="text-xs text-red-500 hover:text-red-400">
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditPage() {
  const logs = [
    {
      time: "۰۸:۳۲",
      user: "مدیر سیستم",
      action: "ورود به سیستم",
      module: "Auth",
      ip: "192.168.1.100",
    },
    {
      time: "۰۸:۳۵",
      user: "علی احمدی",
      action: "ایجاد سفارش تولید PO-2024-0896",
      module: "MES",
      ip: "192.168.1.105",
    },
    {
      time: "۰۸:۴۰",
      user: "حسن کریمی",
      action: 'تغییر وضعیت دستور کار WO-002 به "در حال انجام"',
      module: "CMMS",
      ip: "192.168.1.110",
    },
    {
      time: "۰۸:۴۵",
      user: "رضا موسوی",
      action: "ثبت گزارش حادثه INC-001",
      module: "Incidents",
      ip: "192.168.1.115",
    },
    {
      time: "۰۸:۵۰",
      user: "سعید نوری",
      action: "ثبت ورود کالا - محموله M-2234",
      module: "WMS",
      ip: "192.168.1.120",
    },
    {
      time: "۰۹:۰۰",
      user: "مدیر سیستم",
      action: "ویرایش تنظیمات اعلان‌ها",
      module: "Settings",
      ip: "192.168.1.100",
    },
    {
      time: "۰۹:۱۵",
      user: "محمد حسینی",
      action: "تأیید بازرسی QC-001",
      module: "QMS",
      ip: "192.168.1.125",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Activity size={20} className="text-blue-500" /> لاگ فعالیت‌ها (Audit
        Trail)
      </h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                زمان
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                کاربر
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                فعالیت
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                ماژول
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">
                IP
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr
                key={i}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
              >
                <td className="px-4 py-3 text-sm text-zinc-500 font-mono">
                  {log.time}
                </td>
                <td className="px-4 py-3 text-sm text-white">{log.user}</td>
                <td className="px-4 py-3 text-sm text-zinc-300">
                  {log.action}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                    {log.module}
                  </span>
                </td>
                <td
                  className="px-4 py-3 text-sm text-zinc-600 font-mono"
                  dir="ltr"
                >
                  {log.ip}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LicensesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white">مدیریت لایسنس</h2>
      <div className="bg-zinc-900 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">پلن Enterprise</h3>
            <p className="text-zinc-500">لایسنس فعال تا ۱۴۰۴/۱۲/۲۹</p>
          </div>
          <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-bold">
            فعال
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-white">۲۱</div>
            <div className="text-xs text-zinc-500">ماژول فعال</div>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-white">۱۰۰</div>
            <div className="text-xs text-zinc-500">کاربر مجاز</div>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-white">نامحدود</div>
            <div className="text-xs text-zinc-500">فضای ذخیره</div>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-white">۲۴/۷</div>
            <div className="text-xs text-zinc-500">پشتیبانی</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import toast from "react-hot-toast";
import { useApiConfigStore, deriveWsUrl } from "@/store/apiConfigStore";
import { telemetryService } from "@/services/telemetryService";
import { SENSOR_ALERT_ENDPOINTS } from "@/services/sensorAlertEndpoints";

function IntegrationsPage() {
  const integrations = [
    { name: "OPC-UA Server", status: "متصل", type: "صنعتی", icon: "🔌" },
    { name: "MQTT Broker", status: "متصل", type: "IoT", icon: "📡" },
    { name: "SAP ERP", status: "غیرفعال", type: "ERP", icon: "🏢" },
    { name: "OpenAI GPT-4", status: "متصل", type: "AI", icon: "🧠" },
    { name: "Claude AI", status: "متصل", type: "AI", icon: "🤖" },
    { name: "SMTP Email", status: "متصل", type: "اعلان", icon: "📧" },
    { name: "SMS Gateway", status: "متصل", type: "اعلان", icon: "📱" },
    { name: "Active Directory", status: "غیرفعال", type: "SSO", icon: "🔐" },
  ];

  // ── Sensor Alert API configuration state ──
  const {
    sensorAlertApiBaseUrl,
    sensorAlertWebSocketUrl,
    wsConnectionStatus,
    saveConfiguration,
  } = useApiConfigStore();

  const [restUrlInput, setRestUrlInput] = useState(sensorAlertApiBaseUrl);
  const [wsUrlInput, setWsUrlInput] = useState(sensorAlertWebSocketUrl);
  const [showSensorCard, setShowSensorCard] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      await telemetryService.getAlertEvents();
      toast.success("اتصال به Sensor Alert API موفقیت‌آمیز بود");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "خطا در اتصال به Sensor Alert API";
      toast.error(msg);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const trimmedRest = restUrlInput.trim();
    const trimmedWs = wsUrlInput.trim();
    saveConfiguration(trimmedRest, trimmedWs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRestUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setRestUrlInput(newUrl);
    // Auto-derive WebSocket URL from REST URL
    setWsUrlInput(deriveWsUrl(newUrl));
  };

  const resetToDefault = () => {
    const defaultUrl =
      import.meta.env.VITE_API_URL || "http://87.107.146.212:8000";
    setRestUrlInput(defaultUrl);
    setWsUrlInput(deriveWsUrl(defaultUrl));
  };

  const wsStatusColor =
    wsConnectionStatus === "connected"
      ? "text-green-500"
      : wsConnectionStatus === "connecting"
      ? "text-amber-500"
      : "text-zinc-500";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <GitBranch size={20} className="text-blue-500" /> یکپارچه‌سازی‌ها
        </h2>
        <button
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
          onClick={() => setShowSensorCard((v) => !v)}
        >
          <Plus size={16} />
          {showSensorCard ? "بستن کارت" : "پیکربندی API"}
        </button>
      </div>

      {/* ── Dedicated Sensor Alert API configuration card ── */}
      <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setShowSensorCard((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="text-white font-bold text-sm">
                Sensor Alert API
              </h3>
              <p className="text-xs text-zinc-500">
                API هشدارهای سنسور — REST + WebSocket
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-medium ${wsStatusColor}`}
            >
              {wsConnectionStatus === "connected"
                ? "● متصل"
                : wsConnectionStatus === "connecting"
                ? "● در حال اتصال"
                : "○ قطع"}
            </span>
            <ChevronDown
              size={16}
              className={`text-zinc-500 transition-transform ${
                showSensorCard ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {showSensorCard && (
          <div className="px-4 pb-4 border-t border-zinc-800 space-y-4">
            {/* REST API URL */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                REST API Base URL
              </label>
              <input
                type="url"
                value={restUrlInput}
                onChange={handleRestUrlChange}
                placeholder="http://host:port"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-mono text-sm"
                dir="ltr"
              />
              <p className="text-xs text-zinc-500 mt-1">
                آدرس پایه API برای درخواست‌های REST
              </p>
            </div>

            {/* WebSocket URL */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                WebSocket URL
              </label>
              <input
                type="url"
                value={wsUrlInput}
                onChange={(e) => setWsUrlInput(e.target.value)}
                placeholder="ws://host:port/ws/telemetry/alerts/"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-mono text-sm"
                dir="ltr"
              />
              <p className="text-xs text-zinc-500 mt-1">
                URL درون‌برنامه‌ریزی شده به‌صورت خودکار از REST URL
              </p>
            </div>

            {/* Read-only endpoint paths */}
            <div>
              <h4 className="text-xs text-zinc-500 mb-2">
                مسیرهای Endpoints (فقط خواندنی)
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                  <span className="text-xs text-zinc-400">Alert Rules:</span>
                  <span
                    className="text-xs text-zinc-300 font-mono"
                    dir="ltr"
                  >
                    {SENSOR_ALERT_ENDPOINTS.ALERT_RULES}
                  </span>
                </div>
                <div className="flex justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                  <span className="text-xs text-zinc-400">Alert Events:</span>
                  <span
                    className="text-xs text-zinc-300 font-mono"
                    dir="ltr"
                  >
                    {SENSOR_ALERT_ENDPOINTS.ALERT_EVENTS}
                  </span>
                </div>
                <div className="flex justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                  <span className="text-xs text-zinc-400">WebSocket:</span>
                  <span
                    className="text-xs text-zinc-300 font-mono"
                    dir="ltr"
                  >
                    {SENSOR_ALERT_ENDPOINTS.WEBSOCKET}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {testing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Activity size={14} />
                )}
                {testing ? "در حال تست..." : "تست اتصال"}
              </button>

              <button
                onClick={handleSave}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                {saved ? "ذخیره شد!" : "ذخیره"}
              </button>

              <button
                onClick={resetToDefault}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2 text-zinc-500 hover:text-zinc-300 rounded-xl text-sm transition-all"
              >
                <RefreshCw size={14} />
                بازنشانی به پیش‌فرض
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Existing integrations grid ── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((int) => (
          <div
            key={int.name}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all"
          >
            <div className="text-3xl mb-3">{int.icon}</div>
            <h3 className="text-white font-bold text-sm">{int.name}</h3>
            <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded mt-1 inline-block">
              {int.type}
            </span>
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <span
                className={`text-xs font-medium ${
                  int.status === "متصل"
                    ? "text-green-500"
                    : "text-zinc-500"
                }`}
              >
                {int.status === "متصل" ? "● " : "○ "}
                {int.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
